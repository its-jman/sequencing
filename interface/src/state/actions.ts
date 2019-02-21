import * as api from "src/api";
import { IAppState, IConfirmationParams } from "src/state/models";
import { isEmptyObject } from "src/utils";
import { networkActionThunk } from "src/state/network/utils";
import { ThunkAction } from "redux-thunk";

export enum ActionTypes {
  SET_TITLE = "SET_TITLE",
  LOAD_DATASETS = "LOAD_DATASETS",
  DELETE_DATASET = "DELETE_DATASET",
  FETCH_ALPHABET = "FETCH_ALPHABET",
  FETCH_SEQUENCES = "FETCH_SEQUENCES",
  SET_MODAL = "SET_MODAL",
  SET_CONFIRMATION = "SET_CONFIRMATION",
  SELECT_FILES = "SELECT_FILES"
}

export enum ModalType {
  UPLOAD_MANAGER = "UPLOAD_MANAGER"
}
// export type IModalTypes = keyof typeof ModalType;

export enum ConfirmationType {
  CLEAR_UPLOAD = "CLEAR_UPLOAD"
}
// export type IConfirmationTypes = keyof typeof ConfirmationType;

export const fetchDatasets = () =>
  networkActionThunk({
    type: ActionTypes.LOAD_DATASETS,
    callAPI: api.fetchDatasets
  });

export const deleteDataset = ({ _id }: { _id: string }) =>
  networkActionThunk({
    type: ActionTypes.DELETE_DATASET,
    callAPI: () => api.deleteDataset({ _id })
  });

export const fetchAlphabet = () =>
  networkActionThunk({
    type: ActionTypes.FETCH_ALPHABET,
    callAPI: api.fetchAlphabet,
    shouldCallAPI: (state: IAppState) => isEmptyObject(state.alphabet.data)
  });

export const fetchSequences = ({ _id }: { _id: string }) =>
  networkActionThunk({
    type: ActionTypes.FETCH_SEQUENCES,
    callAPI: () => api.fetchSequences({ _id }),
    shouldCallAPI: (state: IAppState) => isEmptyObject(state.datasets.data[_id].sequences)
  });

export const setModal = (payload: { modalType: ModalType; status: boolean }) => ({
  type: ActionTypes.SET_MODAL,
  ...payload
});

export const setConfirmation = (payload: {
  confirmationType: ConfirmationType;
  params: IConfirmationParams;
  status: boolean;
}) => ({
  type: ActionTypes.SET_CONFIRMATION,
  ...payload
});

export const selectFiles = (params: { files: Array<string> }) => ({
  type: ActionTypes.SELECT_FILES,
  ...params
});
