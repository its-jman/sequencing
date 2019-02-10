import { configureStore } from "redux-starter-kit";
import logger from "redux-logger";

import { contextReducer, datasetsReducer, IContextState, IDatasetsState } from "src/state/reducers";

export interface IAppState {
  context: IContextState;
  datasets: IDatasetsState;
}

export const store = configureStore<IAppState>({
  reducer: {
    context: contextReducer,
    datasets: datasetsReducer
  },
  middleware: [logger]
});
