import { applyMiddleware, createStore } from "redux";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";

import rootReducer from "src/state/reducers";
import { APIMiddleware } from "src/state/network/middleware";
import { ComponentType } from "react";

const logger = createLogger({
  collapsed: () => true,
  predicate: (getState, action) => !action.apiRequest
});

export const store = createStore(rootReducer, applyMiddleware(thunk, logger, APIMiddleware));

// TODO: export type GetProps<C> = C extends ComponentType<infer P> ? P : never;
//    This is a way to pull generic from an instance of an object?
