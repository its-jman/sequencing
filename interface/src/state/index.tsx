import { createStore } from "./utils";

const AppState = {
  datasets: {
    1234: {
      selected: true,
      name: "",
      user_filename: "",
      upload_time: "",
      sequences: {
        start_id: "",
        sort_by: "",
        items: []
      }
    }
  },
  queries: {
    "RXRX{33}RR": {}
  }
};

export const store = createStore();
