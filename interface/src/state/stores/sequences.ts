import { action, autorun, computed, IComputedValue, observable, reaction, runInAction } from "mobx";

import { api } from "src/api";
import { DATASETS_NETWORK_PAGE_SIZE, ISequence, NetworkStatus } from "src/state/models";
import { LimitedObservableMap, range, timeout } from "src/utils";
import { UIStore, uiStoreRaw } from "./ui";
import { createContext } from "react";

type IListIndexes = { start: number; end: number };
type IPage = { i: number; ns: NetworkStatus; items: ISequence[] };

type IGetSequences = { loading: boolean; sequences: ISequence[] };

class DatasetSequencesCache {
  static PAGE_SIZE = DATASETS_NETWORK_PAGE_SIZE;
  @observable totalCount: number | null = null;
  @observable pages: LimitedObservableMap<number, IPage> = new LimitedObservableMap(12);

  constructor(private readonly datasetId: string, private readonly uiStore: UIStore) {
    this.datasetId = datasetId;
    this.uiStore = uiStore;

    (async () => {
      for (let i = 0; i < 3; i++) {
        await this._fetchItemCount();
        if (this.totalCount !== null) break;
      }
    })();
  }

  @action private async _fetchItemCount() {
    try {
      if (this.totalCount !== null) return;
      const response = await api.fetchSequences(this.datasetId, 0, this.uiStore.filter, 0);

      runInAction("_fetchItemCount.success", () => {
        if (this.totalCount === null) {
          this.totalCount = response.total_count;
        }
      });
    } catch {}
  }

  private _calcPages({ start, end }: IListIndexes): number[] {
    if (start === end || end < start) {
      throw new Error("DatasetSequencesCache._calcPages: Start must be less than end");
    }

    const begPage = Math.floor(start / DatasetSequencesCache.PAGE_SIZE);
    const endPage = Math.floor(end / DatasetSequencesCache.PAGE_SIZE);

    return range(begPage, endPage);
  }

  @action private async _fetchPage(pageI: number) {
    const page = this.pages.get(pageI);
    if (page === undefined) throw new Error("DatasetSequencesCache._fetchPage: page is undef...?");

    if (page.ns === NetworkStatus.UNSENT || page.ns === NetworkStatus.FAILURE) {
      const shouldDelay = page.ns === NetworkStatus.FAILURE;

      const act = (pageI: number) => {
        if (page === undefined) throw new Error("fetchPage: page is undef...? 2");

        page.ns = NetworkStatus.REQUEST;
        api
          .fetchSequences(this.datasetId, pageI, this.uiStore.filter)
          .then((response) => {
            runInAction("fetchSequencesSuccess", () => {
              if (page === undefined) throw new Error("fetchPage: page is undef...? 3");

              if (this.totalCount !== null && response.total_count !== this.totalCount) {
                console.groupCollapsed(
                  "%cgetPages: Unexpected total_count in response. ",
                  "background-color: hsla(44, 91%, 65.3%, .4); color: #caa53d"
                );
                console.log(`Expected: ${this.totalCount}`);
                console.log(`Response: ${response.total_count}`);
                console.groupEnd();
              }

              if (this.totalCount === null) {
                this.totalCount = response.total_count;
              }
              // TODO: Check ns. This is async.
              page.ns = NetworkStatus.SUCCESS;
              page.items = response.items;
            });
          })
          .catch((error) => {
            runInAction("fetchSequencesFailure", () => {
              console.error("fetchSequencesFailure: ...");
              console.error(error);
              if (page === undefined) throw new Error("fetchPage: page is undef...? 4");
              // TODO: Check ns. This is async.
              page.ns = NetworkStatus.FAILURE;
            });
          });
      };

      shouldDelay ? await timeout(() => act(pageI), 10000) : await act(pageI);
    }
  }

  // TODO: Not possible to have a computed fn? Try running with it, otherwise it should be regular fn
  getSequences({ start, end }: IListIndexes): IGetSequences {
    const pagesI = this._calcPages({ start, end });

    const loading = !pagesI.every((pageI) => {
      const page = this.pages.get(pageI);
      return page !== undefined && page.ns === NetworkStatus.SUCCESS;
    });

    pagesI.forEach((pageI) => {
      let page = this.pages.get(pageI);
      if (page === undefined) {
        page = observable({ i: pageI, ns: NetworkStatus.UNSENT, items: [] });
        this.pages.set(pageI, page);
      }

      if (page.ns !== NetworkStatus.SUCCESS) {
        if (page && (page.ns === NetworkStatus.UNSENT || page.ns === NetworkStatus.FAILURE)) {
          this._fetchPage(pageI);
        }
      }
    });

    let sequences: ISequence[] = [];
    if (!loading) {
      for (const pageI of pagesI) {
        const page = this.pages.get(pageI);
        if (page === undefined || page.ns !== NetworkStatus.SUCCESS) {
          sequences = [];
          break;
        }

        let [pageStart, pageEnd] = [0, DatasetSequencesCache.PAGE_SIZE];
        if (pageI === pagesI[0]) pageStart = start % DatasetSequencesCache.PAGE_SIZE;
        if (pageI === pagesI[pagesI.length - 1]) pageEnd = end % DatasetSequencesCache.PAGE_SIZE;

        const pageItems = page.items.slice(pageStart, pageEnd + 1);
        if (pageItems.length - 1 !== pageEnd - pageStart) {
          console.groupCollapsed(
            "%cpageItems.length is not the expected value.",
            "background-color: hsla(44, 91%, 65.3%, .4); color: #caa53d"
          );
          console.log(`Expected: ${pageEnd - pageStart}`);
          console.log(`Actual: ${pageItems.length}`);
          console.groupEnd();
        }

        sequences.push(...pageItems);
      }
    }

    // TODO: Test
    return { loading, sequences };
  }
}

class SequencesStore {
  // TODO: Does this need to be observable?
  @observable private dsMap: { [datasetId: string]: DatasetSequencesCache } = {};
  private disposer: (() => void) | null = null;

  constructor(private readonly uiStore: UIStore) {
    this.uiStore = uiStore;

    this.disposer = reaction(
      () => this.uiStore.filter,
      () => {
        this.dsMap = {};
      },
      {
        name: "setFilter:clearSequences"
      }
    );
  }

  // TODO: Should this have a decorator?
  @action getDSCache(datasetId: string): DatasetSequencesCache {
    let dsCache = this.dsMap[datasetId];
    if (dsCache === undefined) {
      // Since this is not part of an observable object to start, mark it as observable by hand
      dsCache = observable(new DatasetSequencesCache(datasetId, this.uiStore));
      this.dsMap[datasetId] = dsCache;
    }
    return dsCache;
  }
}

const sequencesStoreRaw = new SequencesStore(uiStoreRaw);
export const SequencesContext = createContext(sequencesStoreRaw);
