import { createReducer } from "redux-starter-kit";
import { IDataset } from "src/state/models";
import * as a from "src/state/actions";

export interface IDatasetsState {
  [_id: string]: IDataset;
}

export const datasetsReducer = createReducer<IDatasetsState>(
  {},
  {
    [a.fetchDatasets.type]: (draft, action) => {
      for (const dataset of action.payload.items) {
        if (dataset._id in draft) {
          draft[dataset._id] = {
            ...draft[dataset._id],
            ...dataset
          };
        } else {
          draft[dataset._id] = dataset;
        }
      }
    }
  }
);

export interface IContextState {
  title: string | undefined;
}

export const contextReducer = createReducer<IContextState>(
  { title: undefined },
  {
    [a.setTitle.type]: (draft, action) => {
      draft.title = action.payload;
    }
  }
);
