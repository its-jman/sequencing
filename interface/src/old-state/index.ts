import { createStore, combineReducers, applyMiddleware } from "redux";
import logger from "redux-logger";

import { datasetsReducer, contextReducer, IContextState, IDatasetsState } from "src/state/reducers";

export interface IAppState {
  context: IContextState;
  datasets: IDatasetsState;
}

const reducer = combineReducers<IAppState>({
  context: contextReducer.call,
  datasets: datasetsReducer.call
});

export const store = createStore(reducer, applyMiddleware(logger));
