import { IDataset } from "src/state/models";
import { ActionCreator, Reducer } from "src/state/typed";
import { NetworkActionCreator } from "src/state/typed/actions";
import * as api from "src/api";

type IFetchDatasetsResponse = {
  items: Array<IDataset>;
};

export const fetchDatasets = new NetworkActionCreator<{}, IFetchDatasetsResponse>(
  "FETCH_DATASETS",
  api.fetchDatasets,
  {}
);

export const clearDatasets = new ActionCreator<undefined>("CLEAR_DATASETS");

export const setTitle = new ActionCreator<string | undefined>("SET_TITLE");
