import { combineReducers } from "redux";

import { IDataState } from "src/state/models";

import alphabetReducer from "./alphabet";
import datasetsReducer from "./datasets";
import queriesReducer from "./queries";
import sequencesReducer from "./sequences";

export default combineReducers<IDataState>({
  alphabet: alphabetReducer,
  datasets: datasetsReducer,
  queries: queriesReducer,
  sequences: sequencesReducer
});
