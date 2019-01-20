import api from "../../api";
import types from "./types";
import { makeAction } from "./utils";

export const uploadDataset = (data) => {
  return {
    apiRequest: true,
    type: types.UPLOAD_DATASET,
    callAPI: api.datasets.post,
    payload: { data }
  };
};

export const loadDatasets = () => {
  return {
    apiRequest: true,
    type: types.LOAD_DATASETS,
    callAPI: api.datasets.get
  };
};

export const loadDatasetSequences = (datasetID) => {
  return {
    apiRequest: true,
    type: types.LOAD_DATASET_SEQUENCES,
    shouldCallAPI: (state) => state.sequences.data.datasetID !== datasetID,
    callAPI: api.datasets.getSequences,
    payload: { datasetID }
  };
};

export const loadQuery = (rawPattern) => {
  if (rawPattern === undefined || rawPattern === "") {
    return {
      type: types.CLEAR_QUERY
    };
  }

  return {
    apiRequest: true,
    type: types.LOAD_QUERY,
    callAPI: api.search.get,
    payload: { rawPattern }
  };
};

export const loadQueryMatches = ({ rawPattern, datasetID }) => {
  if (rawPattern === undefined || rawPattern === "") {
    return {
      type: types.CLEAR_QUERY
    };
  }

  return {
    apiRequest: true,
    type: types.LOAD_QUERY_MATCHES,
    shouldCallAPI: (state) => {
      return state.sequences.data.matches === {} || state.sequences.data.datasetID !== datasetID;
    },
    callAPI: api.search.getSequences,
    payload: { rawPattern, datasetID }
  };
};

export const deleteDataset = (datasetID) => {
  return {
    apiRequest: true,
    type: types.DELETE_DATASET,
    callAPI: api.datasets.delete,
    payload: { datasetID }
  };
};

export const setActive = makeAction(types.SET_ACTIVE, "datasetID");
