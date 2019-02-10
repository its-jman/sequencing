import { Reducer } from "src/state/typed";
import { IDataset } from "src/state/models";
import * as a from "src/state/actions";

export interface IDatasetsState {
  [_id: string]: IDataset;
}

export const datasetsReducer = new Reducer<IDatasetsState>({}).registerCase(
  a.fetchDatasets,
  (state, action) => state
);

export interface IContextState {
  title: string | undefined;
}

export const contextReducer = new Reducer<IContextState>({ title: undefined }).registerCase(
  a.setTitle,
  (state, action) => {
    state.title = action.payload;
    return state;
  }
);
