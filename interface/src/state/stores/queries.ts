import { action, observable, runInAction } from "mobx";
import { createContext } from "react";
import { IQuery, NetworkStatus } from "src/state/models";
import { api } from "src/api";
import { arrayToObject, timeout } from "src/utils";

class QueriesStore {
  @observable historyNS: NetworkStatus = NetworkStatus.UNSENT;
  @observable history: { [id: string]: IQuery } = {};

  @observable creation: {
    ns: NetworkStatus;
    rawPattern: string;
    errors: string[];
  } | null = null;

  constructor() {
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

  @action createQuery(rawPattern: string) {
    if (
      Object.values(this.history).filter((query) => query.raw_pattern === rawPattern).length > 0
    ) {
      console.error("Trying to create queryId that already exists");
      return;
    }

    if (this.creation !== null) {
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
            if (this.creation === null) throw new Error("createQuery: creation === null");
            this.creation.ns = NetworkStatus.FAILURE;
            this.creation.errors = response.errors;
          });
        } else {
          runInAction("createQuerySuccess", () => {
            this.creation = null;
            this.history[response.query._id] = response.query;
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

const queriesStoreRaw = new QueriesStore();
export const QueriesContext = createContext(queriesStoreRaw);
