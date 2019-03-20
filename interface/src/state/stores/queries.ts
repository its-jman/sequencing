import { action, observable, runInAction } from "mobx";
import { createContext } from "react";
import { IQuery, NetworkStatus } from "src/state/models";
import { api } from "src/api";
import { arrayToObject, timeout } from "src/utils";
import { UIStore, uiStoreRaw } from "src/state/stores/ui";

class QueriesStore {
  @observable historyNS: NetworkStatus = NetworkStatus.UNSENT;
  @observable history: { [id: string]: IQuery } = {};

  @observable creation: {
    ns: NetworkStatus;
    rawPattern: string;
    errors: string[];
  } | null = null;

  constructor(private uiStore: UIStore) {
    this.uiStore = uiStore;

    (async () => {
      for (let i = 0; i < 3; i++) {
        await this.fetchHistory();
        if (this.historyNS === NetworkStatus.SUCCESS) break;
      }
    })();
  }

  @action async fetchHistory() {
    const act = async () => {
      try {
        const response = await api.fetchQueriesHistory();
        if (!Array.isArray(response)) {
          throw new Error("fetchHistory: invalid_response");
        }

        runInAction("fetchHistorySuccess", () => {
          this.historyNS = NetworkStatus.SUCCESS;
          this.history = arrayToObject(response);
        });
      } catch (error) {
        runInAction("fetchHistoryFailure", () => {
          console.error(`fetchHistory: ${error}`);
          this.historyNS = NetworkStatus.FAILURE;
        });
      }
    };

    const shouldDelay = this.historyNS === NetworkStatus.FAILURE;
    this.historyNS = NetworkStatus.REQUEST;

    shouldDelay ? await timeout(act, 10000) : await act();
  }

  getMatchingPattern(rawPattern: string) {
    const matching = Object.values(this.history).filter(
      (query) => query.raw_pattern === rawPattern
    );
    return matching[0];
  }

  @action createQuery(rawPattern: string) {
    const matching = this.getMatchingPattern(rawPattern);
    if (matching !== undefined) {
      // Don't bother checking anything about current .creation
      this.uiStore.updateFilter({
        queryId: matching._id
      });
      return;
    }

    if (this.creation !== null) {
      console.warn("creation is not null.");
      if (this.creation.ns === NetworkStatus.REQUEST) {
        console.warn("createQuery: ns === REQUEST. Ignoring.");
        return;
      } else {
        console.warn("Discarding old query.");
        this.creation = null;
      }
    }

    this.creation = {
      ns: NetworkStatus.REQUEST,
      rawPattern,
      errors: []
    };

    api
      .createQuery(rawPattern)
      .then((response) => {
        if (response.errors.length > 0) {
          runInAction("createQueryFailure", () => {
            if (this.creation === null) {
              console.warn("createQueryFailure: .creation === null -> skipping");
              return;
            }
            this.creation.ns = NetworkStatus.FAILURE;
            this.creation.errors = response.errors;
          });
        } else {
          runInAction("createQuerySuccess", () => {
            if (this.creation === null) {
              console.warn("createQuerySuccess: .creation === null -> skipping");
              return;
            }

            console.log("RES");
            console.log(response);
            this.history[response.query._id] = response.query;
            this.creation = {
              ns: NetworkStatus.SUCCESS,
              errors: [],
              rawPattern
            };

            this.uiStore.updateFilter({
              queryId: response.query._id
            });
          });
        }
      })
      .catch((error) => {
        runInAction("createQueryCatch", () => {
          console.error("createQueryCatch: error");
          console.error(error);
          if (this.creation !== null) {
            this.creation.ns = NetworkStatus.FAILURE;
            this.creation.errors = ["caught_error"];
          }
        });
      });
  }
}

const queriesStoreRaw = new QueriesStore(uiStoreRaw);
export const QueriesContext = createContext(queriesStoreRaw);
