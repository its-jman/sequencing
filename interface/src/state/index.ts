import { applyMiddleware, compose, createStore } from "redux";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";

import rootReducer from "src/state/reducers";

const logger = createLogger({
  collapsed: () => true,
  predicate: (getState, action) => !(action.apiRequest || action.type === "SET_MODAL")
});

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk, logger)));

// TODO: export type GetProps<C> = C extends ComponentType<infer P> ? P : never;
//    This is a way to pull generic from an instance of an object?
