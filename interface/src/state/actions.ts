import * as api from "src/api";
import { isEmptyObject } from "src/utils";
import { networkActionThunk } from "src/state/network/utils";
import { IAppState, IConfirmationParams } from "src/state/models";

export enum ActionTypes {
  SET_TITLE = "SET_TITLE",
  LOAD_DATASETS = "LOAD_DATASETS",
  DELETE_DATASET = "DELETE_DATASET",
  FETCH_ALPHABET = "FETCH_ALPHABET",
  FETCH_SEQUENCES = "FETCH_SEQUENCES",
  SET_MODAL = "SET_MODAL",
  SHOW_CONFIRMATION = "SET_CONFIRMATION",
  SELECT_FILES = "SELECT_FILES",
  CLEAR_CONFIRMATION = "CLEAR_CONFIRMATION",
  CANCEL_FILE = "CANCEL_FILE",
  SUBMIT_UPLOAD = "SUBMIT_UPLOAD",
  SET_FILE_INPUT = "SET_FILE_INPUT",
  OPEN_FILE_INPUT = "OPEN_FILE_INPUT"
}

export enum ModalType {
  UPLOAD_MANAGER = "UPLOAD_MANAGER"
}
// export type IModalTypes = keyof typeof ModalType;

export enum ConfirmationType {
  RESUME_UPLOAD = "CLEAR_UPLOAD"
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

export const showConfirmation = (payload: {
  confirmationType: ConfirmationType;
  params: IConfirmationParams;
}) => ({
  type: ActionTypes.SHOW_CONFIRMATION,
  ...payload
});

export const clearConfirmation = (payload: { confirmationType: ConfirmationType }) => ({
  type: ActionTypes.CLEAR_CONFIRMATION,
  ...payload
});

export const setFileInput = (params: { fileInput: HTMLInputElement | null }) => ({
  type: ActionTypes.SET_FILE_INPUT,
  ...params
});

export const selectFiles = (params: { files: Array<File> }) => ({
  type: ActionTypes.SELECT_FILES,
  ...params
});

export const cancelFile = (params: { i: number }) => ({
  type: ActionTypes.CANCEL_FILE,
  ...params
});

export const submitUpload = (params: {}) => ({
  type: ActionTypes.SUBMIT_UPLOAD,
  ...params
});
