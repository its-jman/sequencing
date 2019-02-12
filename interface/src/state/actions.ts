import * as api from "src/api";

export const actions = {
  SET_TITLE: "SET_TITLE",
  LOAD_DATASETS: "LOAD_DATASETS",
  DELETE_DATASET: "DELETE_DATASET"
};

export const fetchDatasets = () => ({
  apiRequest: true,
  type: actions.LOAD_DATASETS,
  callAPI: api.fetchDatasets
});

export const deleteDataset = (_id: string) => ({
  apiRequest: true,
  type: actions.DELETE_DATASET,
  callAPI: () => api.deleteDataset(_id)
});
