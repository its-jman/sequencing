import { createStore, combineReducers, applyMiddleware } from "redux";
import logger from "redux-logger";

import { datasetsReducer } from "src/state/reducers";

const reducer = combineReducers({
  datasets: datasetsReducer.call
});

export const store = createStore(reducer, applyMiddleware(logger));
