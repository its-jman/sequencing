import {
  IAlphabetState,
  IAppState,
  IDataset,
  ISequence,
  IUpload,
  NetworkStatus
} from "src/state/models";
import * as api from "src/api";
import { isEmpty } from "src/utils";
import { networkActions as na } from "src/state/actions/network";
import { actions, IThunkAction } from "src/state/actions";
import { ModalType } from "src/state/constants";

const fetchDatasets = (): IThunkAction => (dispatch, getState) => {
  const state = getState();
  if (!isEmpty(state.data.datasets) || state.data.network.datasets === NetworkStatus.SUCCESS) {
    console.warn("Fetch Datasets attempted sending while data already populated.");
    return;
  }

  dispatch(na.fetchDatasetsRequest());
  api
    .fetchDatasets()
    .then(
      (response: IDataset[]) => dispatch(na.fetchDatasetsSuccess(response)),
      (error) => dispatch(na.fetchDatasetsFailure(error))
    );
};

const deleteDataset = (id: string): IThunkAction => (dispatch) => {
  dispatch(na.deleteDatasetRequest({ id }));
  api
    .deleteDataset({ id })
    .then(
      () => dispatch(na.deleteDatasetSuccess({ id })),
      (error) => dispatch(na.deleteDatasetFailure({ id, error }))
    );
};

const fetchSequences = (payload: { id: string; page: number }): IThunkAction => (dispatch) => {
  dispatch(na.fetchSequencesRequest(payload));
  api
    .fetchSequences(payload)
    .then(
      (response: { items: ISequence[] }) =>
        dispatch(na.fetchSequencesSuccess({ ...payload, sequences: response.items })),
      (error) => dispatch(na.fetchSequencesFailure({ ...payload, error }))
    );
};

const fetchAlphabet = (): IThunkAction => (dispatch, getState) => {
  const state: IAppState = getState();
  const { alphabet: ns } = state.data.network;

  if (
    !isEmpty(state.data.alphabet) ||
    ns === NetworkStatus.SUCCESS ||
    ns === NetworkStatus.REQUEST
  ) {
    return;
  }

  dispatch(na.fetchAlphabetRequest());
  api
    .fetchAlphabet()
    .then(
      (response: IAlphabetState) => dispatch(na.fetchAlphabetSuccess(response)),
      (error) => dispatch(na.fetchAlphabetFailure(error))
    );
};

const validateUpload = (upload: IUpload) => {
  const errs: string[] = [];
  if (isEmpty(upload.name)) {
    errs.push("Name can not be empty");
  }

  return errs;
};

const submitUpload = (i: number): IThunkAction => (dispatch, getState) => {
  const state = getState();
  const upload = state.ui.uploadManager.upload;
  if (upload === null) {
    throw new Error(`Invalid upload index: ${i}`);
  }

  if (
    NetworkStatus.UNSENT ||
    (upload.status === NetworkStatus.FAILURE && upload.errors.length === 0)
  ) {
    const errors = validateUpload(upload);
    if (errors.length > 0) {
      dispatch(na.submitUploadFailure({ i, errors }));
      return;
    }

    if (i >= 0 /*state.ui.uploadManager.uploads.length - 1*/) {
      dispatch(actions.setModal({ modalType: ModalType.UPLOAD_MANAGER, status: false }));
    }

    dispatch(na.submitUploadRequest({ i }));
    api.submitUpload(upload).then(
      (response: { errors: string[]; dataset: IDataset | null }) => {
        if (response.errors.length > 0 || response.dataset === null) {
          console.warn("Received failure when uploading dataset");
          dispatch(na.submitUploadFailure({ i, errors: response.errors }));
        } else {
          dispatch(na.submitUploadSuccess({ i, dataset: response.dataset }));
        }
      },
      (error) => {
        console.error("Submit upload failed with error");
        console.error(error);
        dispatch(na.submitUploadFailure(error));
      }
    );
  } else {
    console.warn(
      "Trying to upload file that was already sent, or hasn't been modified since errors were thrown"
    );
  }
};

export const thunks = {
  fetchDatasets,
  deleteDataset,
  fetchSequences,
  fetchAlphabet,
  submitUpload
};
