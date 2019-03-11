import { combineReducers } from "redux";

import { IAppState } from "src/state/models";

import uiReducer from "./ui";
import dataReducer from "./data";

export default combineReducers<IAppState>({
  ui: uiReducer,
  data: dataReducer
});
