export const x = 5;
// import { createContext } from "react";
// import { action, computed, observable, runInAction } from "mobx";
//
// import * as api from "src/api";
// import { LimitedObservableMap, timeout } from "src/utils";
// import { ISequence, NetworkStatus } from "src/state/models";
//
// type IFilter = {
//   queryId: string | null;
//   descFilter: string | null;
// };
//
// type IPage = { i: number; ns: NetworkStatus; pages: ISequence[] };
//
// class SequencesStore {
//   @observable totalCount: number | null = null;
//   @observable pages: LimitedObservableMap<number, IPage> = new LimitedObservableMap(12);
//
//   constructor(private datasetId: string, private filter: IFilter) {}
//
//   @action private async _fetchPageAct(pageI: number) {
//     try {
//       const page = this.pages.get(pageI);
//       if (page === null) throw new Error("fetchPage: page is null...? 2");
//       page.ns = NetworkStatus.REQUEST;
//
//       const response = await api.fetchSequences(this.datasetId, pageI, this.filter);
//       runInAction("fetchSequencesSuccess", () => {
//         if (this.totalCount !== null && response.total_count !== this.totalCount) {
//           console.groupCollapsed(
//             "%cgetPages: Unexpected total_count in response. ",
//             "background-color: hsla(44, 91%, 65.3%, .4); color: #caa53d"
//           );
//           console.log(`Expected: ${this.totalCount}`);
//           console.log(`Response: ${response.total_count}`);
//           console.groupEnd();
//         }
//
//         const page = this.pages.get(pageI);
//         if (page === null) throw new Error("fetchPage: page is null...? 2");
//
//         if (this.totalCount === null) {
//           this.totalCount = response.total_count;
//         }
//         page.ns = NetworkStatus.SUCCESS;
//         page.pages = response.pages;
//       });
//     } catch (error) {
//       runInAction("fetchSequencesFailure", () => {
//         console.error("fetchSequencesFailure: ...");
//         const page = this.pages.get(pageI);
//         if (page === null) throw new Error("fetchPage: page is null...? 3");
//         page.ns = NetworkStatus.FAILURE;
//       });
//     }
//   }
//
//   @action private async fetchPage(pageI: number) {
//     const page =
//       this.pages.get(pageI) ||
//       this.pages.push(pageI, observable({ i: pageI, ns: NetworkStatus.UNSENT, pages: [] }));
//     if (page === null) throw new Error("fetchPage: page is null...?");
//
//     if (page.ns === NetworkStatus.UNSENT || page.ns === NetworkStatus.FAILURE) {
//       const shouldDelay = page.ns === NetworkStatus.FAILURE;
//
//       shouldDelay
//         ? await timeout(() => this._fetchPageAct(pageI), 10000)
//         : await this._fetchPageAct(pageI);
//     }
//   }
//
//   // @computed getPage(pageI: number): IPage {}
// }
//
// class FilterStore {
//   @observable filter: IFilter = { queryId: null, descFilter: null };
//   @observable dsMap: { [datasetId: string]: SequencesStore } = {};
//
//   @action setQueryId(queryId: string | null) {
//     if (queryId === "") queryId = null;
//     this.filter.queryId = queryId;
//     this.dsMap = {};
//   }
//
//   @action setDescFilter(descFilter: string | null) {
//     if (descFilter === "") descFilter = null;
//     this.filter.descFilter = descFilter;
//     this.dsMap = {};
//   }
//
//   // TODO: ?? Action/computed?
//   @computed getSequencesStore(datasetId: string) {
//     if (!(datasetId in this.dsMap)) {
//       this.dsMap[datasetId] = observable(new SequencesStore(datasetId, this.filter));
//     }
//     return this.dsMap[datasetId];
//   }
// }
// /*
// TODO:
//   Move filter state back into UIStore. Now, sequencesStore and datasetsStoreRaw should both depend on
//     uiStoreRaw.filter, each of whom will have an auto-running function based uiStoreRaw.filter which
//     clears old state. (New state should be added in with an @computed call?)
//  */
//
// export const filterStore = new FilterStore();
// export const FilterContext = createContext(filterStore);
