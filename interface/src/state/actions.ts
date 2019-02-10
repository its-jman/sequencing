import { createAction } from "redux-starter-kit";

import { IDataset } from "src/old-state/models";

type IFetchDatasetsPayload = {
  items: Array<IDataset>;
};

export const fetchDatasets = createAction<IFetchDatasetsPayload>("FETCH_DATASETS");
export const clearDatasets = createAction<undefined>("CLEAR_DATASETS");

export const setTitle = createAction<string | undefined>("SET_TITLE");
