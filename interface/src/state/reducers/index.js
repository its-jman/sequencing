import { combineReducers } from "redux";

import { datasets } from "./datasets";
import { selection } from "./selection";
import { query } from "./query";
import { sequences } from "./sequences";

export default combineReducers({
  datasets,
  selection,
  query,
  sequences
});

/*
Store:
  datasets: {
    isFetching: true
    errors: {}
    items: {}
  }
  selection: {
    active: ""
    checked: []
  }
  query: {
    isFetching: true
    errors: {}
    data: {
      raw_pattern: "RXRX33RR"
      regex: "R[A-Z]R[A-Z]{33}RR"
      matches: {
        [dataset.id]:
    }
  }
*/
