import { createContext } from "react";
import { action, observable, runInAction } from "mobx";

import { api } from "src/api";
import { timeout } from "src/utils";
import { IAlphabet, NetworkStatus } from "src/state/models";

class AlphabetStore {
  @observable ns: NetworkStatus = NetworkStatus.UNSENT;
  @observable alphabet: IAlphabet = {};

  constructor() {
    (async () => {
      for (let i = 0; i < 3; i++) {
        await this.fetchAlphabet();
        if (this.ns === NetworkStatus.SUCCESS) break;
      }
    })();
  }

  @action async fetchAlphabet() {
    const act = async () => {
      try {
        const response = await api.fetchAlphabet();

        runInAction("fetchAlphabetSuccess", () => {
          this.ns = NetworkStatus.SUCCESS;
          this.alphabet = response;
        });
      } catch (error) {
        runInAction("fetchAlphabetFailure", () => {
          console.error(`fetchAlphabet: ${error}`);
          this.ns = NetworkStatus.FAILURE;
        });
      }
    };

    const shouldDelay = this.ns === NetworkStatus.FAILURE;
    this.ns = NetworkStatus.REQUEST;

    shouldDelay ? await timeout(act, 10000) : await act();
  }
}

const alphabetStoreRaw = new AlphabetStore();
export const AlphabetContext = createContext(alphabetStoreRaw);
