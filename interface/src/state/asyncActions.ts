import { createAsyncAction, createStandardAction, createAction } from "typesafe-actions";
import uuid4 from "uuid/v4";

import {
  IAlphabetState,
  IAppState,
  IDataset,
  IDatasetsState,
  IDispatchProps,
  INetworkAction,
  ISequence,
  NetworkStatus
} from "src/state/models";
import * as api from "src/api";
import { isEmptyObject } from "src/utils";

interface INetworkStatus<TData> {
  reqID: string;
  reqType: string;
  status: NetworkStatus;
  data: TData;
}

class Request {
  private id: string = uuid4();
  constructor(private type: string) {}
  private base = () => ({
    reqID: this.id,
    reqType: this.type
  });

  request = () => ({
    ...this.base(),
    status: NetworkStatus.REQUEST
  });
  success = () => ({
    ...this.base(),
    status: NetworkStatus.SUCCESS
  });
  failure = () => ({
    ...this.base(),
    status: NetworkStatus.FAILURE
  });
}

// ------------------------------------ Fetch Datasets ---------------------------------------
const fetchDatasetsTypes = createAsyncAction(
  "FETCH_DATASETS_REQUEST",
  "FETCH_DATASETS_SUCCESS",
  "FETCH_DATASETS_FAILURE"
)<INetworkStatus<null>, INetworkStatus<Array<IDataset>>, INetworkStatus<Error>>();
export const fetchDatasets = () => (dispatch: IDispatchProps["dispatch"]) => {
  const req = new Request("FETCH_DATASETS");
  dispatch(fetchDatasetsTypes.request({ ...req.request(), data: null }));
  api
    .fetchDatasets()
    .then(
      (response: Array<IDataset>) =>
        dispatch(fetchDatasetsTypes.success({ ...req.success(), data: response })),
      (error) => dispatch(fetchDatasetsTypes.failure({ ...req.failure(), data: error }))
    );
};
fetchDatasets.request = fetchDatasetsTypes.request;
fetchDatasets.success = fetchDatasetsTypes.success;
fetchDatasets.failure = fetchDatasetsTypes.failure;

// --------------------------------------- Fetch Sequences -----------------------------------
type IFetchSequences = { id: string; page: number };
const fetchSequencesTypes = createAsyncAction(
  "FETCH_SEQUENCES_REQUEST",
  "FETCH_SEQUENCES_SUCCESS",
  "FETCH_SEQUENCES_FAILURE"
)<
  IFetchSequences,
  { details: IFetchSequences; response: Array<ISequence> },
  { details: IFetchSequences; error: Error }
>();
export const fetchSequences = (payload: IFetchSequences) => (dispatch: IDispatchProps["dispatch"]) => {
  dispatch(fetchSequencesTypes.request(payload));
  api
    .fetchSequences(payload)
    .then(
      (response) => dispatch(fetchSequencesTypes.success({ details: payload, response })),
      (error) => dispatch(fetchSequencesTypes.failure({ details: payload, error }))
    );
};
fetchSequences.request = fetchSequencesTypes.request;
fetchSequences.success = fetchSequencesTypes.success;
fetchSequences.failure = fetchSequencesTypes.failure;

// -------------------------------------- Fetch Alphabet -------------------------------------
const fetchAlphabetTypes = createAsyncAction(
  "FETCH_ALPHABET_REQUEST",
  "FETCH_ALPHABET_SUCCESS",
  "FETCH_ALPHABET_FAILURE"
)<void, IAlphabetState, Error>();
export const fetchAlphabet = () => (dispatch: IDispatchProps["dispatch"], getState: any) => {
  const state: IAppState = getState();
  if (!isEmptyObject(state.data.alphabet)) {
    return;
  }

  dispatch(fetchAlphabetTypes.request());
  api
    .fetchAlphabet()
    .then(
      (response) => dispatch(fetchAlphabetTypes.success(response)),
      (error) => dispatch(fetchAlphabetTypes.failure(error))
    );
};
fetchAlphabet.request = fetchAlphabetTypes.request;
fetchAlphabet.success = fetchAlphabetTypes.success;
fetchAlphabet.failure = fetchAlphabetTypes.failure;

// ------------------------------------- Delete Dataset --------------------------------------
const deleteDatasetType = createAsyncAction(
  "DELETE_DATASET_REQUEST",
  "DELETE_DATASET_SUCCESS",
  "DELETE_DATASET_FAILURE"
)<void, void, Error>();
export const deleteDataset = (id: string) => (dispatch: IDispatchProps["dispatch"]) => {
  dispatch(deleteDatasetType.request());
  api
    .deleteDataset({ _id: id })
    .then(() => dispatch(deleteDatasetType.success()), (error) => dispatch(deleteDatasetType.failure(error)));
};
deleteDataset.request = deleteDatasetType.request;
deleteDataset.success = deleteDatasetType.success;
deleteDataset.failure = deleteDatasetType.failure;

// ------------------------------------ Submit Upload ----------------------------------------
// const submitUploadType = createAsyncAction(
//   "SUBMIT_UPLOAD_REQUEST",
//   "SUBMIT_UPLOAD_SUCCESS",
//   "SUBMIT_UPLOAD_FAILURE"
// )<void, { dataset: IDataset }, string[]>();
const submitUploadRequest = createStandardAction("SUBMIT_UPLOAD_REQUEST")<null, INetworkAction>();
export const submitUpload = (payload: { name: string; file: File }) => (
  dispatch: IDispatchProps["dispatch"]
) => {
  const errs: string[] = validateUpload();
  if (errs.length > 0) {
    dispatch(submitUploadType.failure(errs));
    return;
  }

  dispatch(submitUploadRequest(null, req));
  api.submitUpload(payload).then(
    (response: { errors: string[]; dataset: IDataset | null }) => {
      if (response.errors.length > 0) {
        dispatch(submitUploadType.failure(response.errors));
      } else {
        dispatch(submitUploadType.success(response));
      }
    },
    (error) => {
      console.error("Submit upload failed with error");
      console.error(error);
      dispatch(submitUploadType.failure(error));
    }
  );
};
submitUpload.request = submitUploadType.request;
submitUpload.success = submitUploadType.success;
submitUpload.failure = submitUploadType.failure;

export const asyncActions = {
  fetchDatasets,
  fetchAlphabet,
  fetchSequences,
  deleteDataset,
  submitUpload
};
