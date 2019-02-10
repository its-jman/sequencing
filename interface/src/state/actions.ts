import { IDataset } from "src/state/models";
import { ActionCreator, Reducer } from "src/state/typed";

type IFetchDatasetsPayload = {
  items: Array<IDataset>;
};

export const fetchDatasets = new ActionCreator<IFetchDatasetsPayload>("FETCH_DATASETS");
export const clearDatasets = new ActionCreator<undefined>("CLEAR_DATASETS");
