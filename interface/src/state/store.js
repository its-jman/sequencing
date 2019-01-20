import thunk from "redux-thunk";
import { createLogger } from "redux-logger";
import { createStore, applyMiddleware, compose } from "redux";

import rootReducer from "./reducers";
import types from "./actions/types";
import { APIMiddleware } from "./middleware";

const logger = createLogger({
  predicate: (getState, action) => {
    const filter = [types.SET_ACTIVE];
    return !(filter.includes(action.type) || action.apiRequest);
  },
  collapsed: true,
  diff: true
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk, logger, APIMiddleware))
);

// export const store = createStore(rootReducer, applyMiddleware());
