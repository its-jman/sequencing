import { ActionType, createStandardAction } from "typesafe-actions";

import * as api from "src/api";
import { isEmptyObject } from "src/utils";
import { networkActionThunk, IThunkAction } from "src/state/network/utils";
import { IAppState, IConfirmationParams } from "src/state/models";
import { NetworkStatus } from "src/state/network/types";

export enum ActionTypes {
  LOAD_DATASETS = "LOAD_DATASETS",
  DELETE_DATASET = "DELETE_DATASET",
  FETCH_ALPHABET = "FETCH_ALPHABET",
  FETCH_SEQUENCES = "FETCH_SEQUENCES",
  SUBMIT_UPLOAD = "SUBMIT_UPLOAD"
  // SET_MODAL = "SET_MODAL",
  // SELECT_FILES = "SELECT_FILES",
  // CANCEL_FILE = "CANCEL_FILE",
  // SET_FILE_INPUT = "SET_FILE_INPUT"
}

export enum ModalType {
  UPLOAD_MANAGER = "UPLOAD_MANAGER"
}

export enum ConfirmationType {
  RESUME_UPLOAD = "CLEAR_UPLOAD"
}

const fetchDatasets = () =>
  networkActionThunk({
    type: ActionTypes.LOAD_DATASETS,
    callAPI: api.fetchDatasets
  });

const deleteDataset = ({ _id }: { _id: string }) =>
  networkActionThunk({
    type: ActionTypes.DELETE_DATASET,
    callAPI: () => api.deleteDataset({ _id })
  });

const fetchAlphabet = () =>
  networkActionThunk({
    type: ActionTypes.FETCH_ALPHABET,
    callAPI: api.fetchAlphabet,
    shouldCallAPI: (state: IAppState) => isEmptyObject(state.alphabet.data)
  });

const fetchSequences = ({ _id }: { _id: string }) =>
  networkActionThunk({
    type: ActionTypes.FETCH_SEQUENCES,
    callAPI: () => api.fetchSequences({ _id }),
    shouldCallAPI: (state: IAppState) => isEmptyObject(state.datasets.data[_id].sequences)
  });

const submitUpload = (i: number, params: { name: string; file: File }): IThunkAction<IAppState> => (
  dispatch
) => {
  const type = ActionTypes.SUBMIT_UPLOAD;
  const networkAction = (status: NetworkStatus, other: object) => ({
    type,
    status,
    ...other
  });

  api.uploadDataset(params).then(
    (response) => {
      if (response.errors.length > 0) {
        dispatch(networkAction(NetworkStatus.FAILURE, { error: response.errors }));
      } else {
        dispatch(networkAction(NetworkStatus.SUCCESS, { i, response }));
      }
    },
    (error) => dispatch(networkAction(NetworkStatus.FAILURE, { error }))
  );
};

type ISetModal = { modalType: ModalType; status: boolean };
type IShowConfirmation = { confirmationType: ConfirmationType; params: IConfirmationParams };
type IClearConfirmation = { confirmationType: ConfirmationType };

export const actions = {
  setTitle: createStandardAction("CANCEL_FILE")<string | null>(),
  setModal: createStandardAction("SET_MODAL")<ISetModal>(),
  showConfirmation: createStandardAction("SHOW_CONFIRMATION")<IShowConfirmation>(),
  clearConfirmation: createStandardAction("CLEAR_CONFIRMATION")<IClearConfirmation>(),

  selectFiles: createStandardAction("SELECT_FILES")<Array<File>>(),
  setFileInput: createStandardAction("SET_FILE_INPUT")<boolean>(),
  cancelFile: createStandardAction("CANCEL_FILE")<number>(),

  fetchDatasets,
  deleteDataset,
  fetchAlphabet,
  fetchSequences,
  submitUpload
};

export type IActionMap = ActionType<typeof actions>;
