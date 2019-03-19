import { createContext } from "react";
import { action, computed, observable, runInAction } from "mobx";

import { api } from "src/api";
import { IDataset, NetworkStatus } from "src/state/models";
import { arrayToObject, objectIdToDate } from "src/utils";
import { timeout } from "src/utils";

class DatasetsStore {
  @observable datasets: { [id: string]: IDataset } = {};
  @observable ns: NetworkStatus = NetworkStatus.UNSENT;

  constructor() {
    (async () => {
      for (let i = 0; i < 3; i++) {
        await this.fetchDatasets();
        if (this.ns === NetworkStatus.SUCCESS) break;
      }
    })();
  }

  @action async fetchDatasets() {
    const act = async () => {
      try {
        const response = await api.fetchDatasets();
        if (!Array.isArray(response)) {
          throw new Error("fetchDatasets: invalid_response");
        }

        runInAction("fetchDatasetsSuccess", () => {
          this.ns = NetworkStatus.SUCCESS;
          response.forEach((item) => {
            item.upload_time = objectIdToDate(item._id);
          });
          this.datasets = arrayToObject(response);
        });
      } catch (error) {
        runInAction("fetchDatasetsFailure", () => {
          console.error(`fetchDatasets: ${error}`);
          this.ns = NetworkStatus.FAILURE;
        });
      }
    };

    const shouldDelay = this.ns === NetworkStatus.FAILURE;
    this.ns = NetworkStatus.REQUEST;

    shouldDelay ? await timeout(act, 10000) : await act();
  }

  /**
   * This is sorted to attempt to maintain consistency across multiple requests to this..
   */
  @computed get datasetsList(): IDataset[] {
    return Object.values(this.datasets).sort(
      (a, b) => a.upload_time.getTime() - b.upload_time.getTime()
    );
  }
}

const datasetsStoreRaw = new DatasetsStore();
export const DatasetsContext = createContext(datasetsStoreRaw);
