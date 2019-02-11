import { createStore, combineReducers, applyMiddleware } from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";

import { datasetsReducer, contextReducer, IContextState, IDatasetsState } from "src/state/reducers";

export interface IAppState {
  context: IContextState;
  datasets: IDatasetsState;
}

const reducer = combineReducers<IAppState>({
  context: (state, action) => contextReducer.call(state, action),
  datasets: (state, action) => datasetsReducer.call(state, action)
});

export const store = createStore(reducer, applyMiddleware(thunk, logger));
