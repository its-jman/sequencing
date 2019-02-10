import { Reducer } from "src/state/typed";
import { IDataset } from "src/state/models";
import * as a from "src/state/actions";

interface IDatasetsState {
  [_id: string]: IDataset;
}

export const datasetsReducer = new Reducer<IDatasetsState>({}).registerCase(
  a.fetchDatasets,
  (state, action) => state
);
