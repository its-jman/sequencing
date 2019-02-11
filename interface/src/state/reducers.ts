import { Reducer } from "src/state/typed";
import { IDataset } from "src/state/models";
import * as a from "src/state/actions";

export interface IDatasetsState {
  [_id: string]: IDataset;
}

export const datasetsReducer = new Reducer<IDatasetsState>({}).registerNetworkCase(a.fetchDatasets, (state, action) => {
  //@ts-ignore
  for (const item of action.response) {
    console.log("ITEM");
    console.log(item);
    //@ts-ignore
    state = {
      ...state,
      [item._id]: item
    };
  }
  return state;
});

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
