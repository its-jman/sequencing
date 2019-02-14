import * as api from "src/api";

export const actionIDs = {
  SET_TITLE: "SET_TITLE",
  LOAD_DATASETS: "LOAD_DATASETS",
  DELETE_DATASET: "DELETE_DATASET",
  FETCH_ALPHABET: "FETCH_ALPHABET"
};

export const fetchDatasets = () => ({
  apiRequest: true,
  type: actionIDs.LOAD_DATASETS,
  callAPI: api.fetchDatasets
});

export const deleteDataset = ({ _id }: { _id: string }) => ({
  apiRequest: true,
  type: actionIDs.DELETE_DATASET,
  callAPI: () => api.deleteDataset({ _id })
});

export const fetchAlphabet = () => ({
  apiRequest: true,
  type: actionIDs.FETCH_ALPHABET,
  callAPI: api.fetchAlphabet
});
