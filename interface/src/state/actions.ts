import * as api from "src/api";
import { IAppState } from "src/state/models";
import { isEmptyObject } from "src/utils";
import { networkActionThunk } from "src/state/network/utils";
import { ThunkAction } from "redux-thunk";

export const actionIDs = {
  SET_TITLE: "SET_TITLE",
  LOAD_DATASETS: "LOAD_DATASETS",
  DELETE_DATASET: "DELETE_DATASET",
  FETCH_ALPHABET: "FETCH_ALPHABET",
  FETCH_SEQUENCES: "FETCH_SEQUENCES",
  SET_MODAL: "SET_MODAL"
};

export const confirmationModalIDs = {
  VERIFY_DELETE: "VERIFY_DELETE"
};

export const fetchDatasets = () =>
  networkActionThunk({
    type: actionIDs.LOAD_DATASETS,
    callAPI: api.fetchDatasets
  });

export const deleteDataset = ({ _id }: { _id: string }) =>
  networkActionThunk({
    type: actionIDs.DELETE_DATASET,
    callAPI: () => api.deleteDataset({ _id })
  });

export const fetchAlphabet = () =>
  networkActionThunk({
    type: actionIDs.FETCH_ALPHABET,
    callAPI: api.fetchAlphabet,
    shouldCallAPI: (state: IAppState) => isEmptyObject(state.alphabet.data)
  });

export const fetchSequences = ({ _id }: { _id: string }) =>
  networkActionThunk({
    type: actionIDs.FETCH_SEQUENCES,
    callAPI: () => api.fetchSequences({ _id }),
    shouldCallAPI: (state: IAppState) => isEmptyObject(state.datasets.data[_id].sequences)
  });

export const showModal = (
  modalID: string,
  params: { resolve: () => void; reject: () => void }
) => ({
  type: actionIDs.SET_MODAL
});

export const selectFiles = ({ files }: { files: Array<string> }) => {
  return;
};
