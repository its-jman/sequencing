import { computed, observable } from "mobx";
import { enableLogging } from "mobx-logger";

enableLogging();

class DataStore {}

class UIStore {
  @observable pageTitle: string | null = null;
  @observable modal: string | null = null;
  @observable confirmationModals: Array<string> = [];
}

export const Data = new DataStore();
export const UI = new UIStore();

export const store = {
  Data,
  UI
};

export default store;
