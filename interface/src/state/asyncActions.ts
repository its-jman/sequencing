import { createAsyncAction } from "typesafe-actions";

import {
  IAlphabetState,
  IDataset,
  IDatasetsState,
  IDispatchProps,
  ISequence
} from "src/state/models";
import * as api from "src/api";

const fetchDatasetsTypes = createAsyncAction(
  "FETCH_DATASETS_REQUEST",
  "FETCH_DATASETS_SUCCESS",
  "FETCH_DATASETS_FAILURE"
)<void, Array<IDataset>, Error>();
export const fetchDatasets = () => (dispatch: IDispatchProps["dispatch"]) => {
  dispatch(fetchDatasetsTypes.request());
  api
    .fetchDatasets()
    .then(
      (response) => dispatch(fetchDatasetsTypes.success(response)),
      (error) => dispatch(fetchDatasetsTypes.failure(error))
    );
};
fetchDatasets.request = fetchDatasetsTypes.request;
fetchDatasets.success = fetchDatasetsTypes.success;
fetchDatasets.failure = fetchDatasetsTypes.failure;

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
export const fetchSequences = (payload: IFetchSequences) => (
  dispatch: IDispatchProps["dispatch"]
) => {
  dispatch(fetchSequencesTypes.request(payload));
  api
    .fetchDatasets()
    .then(
      (response) => dispatch(fetchSequencesTypes.success({ details: payload, response })),
      (error) => dispatch(fetchSequencesTypes.failure({ details: payload, error }))
    );
};
fetchSequences.request = fetchSequencesTypes.request;
fetchSequences.success = fetchSequencesTypes.success;
fetchSequences.failure = fetchSequencesTypes.failure;

const fetchAlphabetTypes = createAsyncAction(
  "FETCH_ALPHABET_REQUEST",
  "FETCH_ALPHABET_SUCCESS",
  "FETCH_ALPHABET_FAILURE"
)<void, IAlphabetState, Error>();
export const fetchAlphabet = () => (dispatch: IDispatchProps["dispatch"]) => {
  dispatch(fetchAlphabetTypes.request());
  api
    .fetchDatasets()
    .then(
      (response) => dispatch(fetchAlphabetTypes.success(response)),
      (error) => dispatch(fetchAlphabetTypes.failure(error))
    );
};
fetchAlphabet.request = fetchAlphabetTypes.request;
fetchAlphabet.success = fetchAlphabetTypes.success;
fetchAlphabet.failure = fetchAlphabetTypes.failure;

const deleteDatasetType = createAsyncAction(
  "DELETE_DATASET_REQUEST",
  "DELETE_DATASET_SUCCESS",
  "DELETE_DATASET_FAILURE"
)<void, void, Error>();
export const deleteDataset = (id: string) => (dispatch: IDispatchProps["dispatch"]) => {
  dispatch(deleteDatasetType.request());
  api
    .deleteDataset({ _id: id })
    .then(
      () => dispatch(deleteDatasetType.success()),
      (error) => dispatch(deleteDatasetType.failure(error))
    );
};
deleteDataset.request = deleteDatasetType.request;
deleteDataset.success = deleteDatasetType.success;
deleteDataset.failure = deleteDatasetType.failure;

const submitUploadType = createAsyncAction(
  "SUBMIT_UPLOAD_REQUEST",
  "SUBMIT_UPLOAD_SUCCESS",
  "SUBMIT_UPLOAD_FAILURE"
)<void, { dataset: IDataset }, Error>();
export const submitUpload = (payload: { name: string; file: File }) => (
  dispatch: IDispatchProps["dispatch"]
) => {
  dispatch(submitUploadType.request());
  api
    .submitUpload(payload)
    .then(
      (response) => dispatch(submitUploadType.success(response)),
      (error) => dispatch(submitUploadType.failure(error))
    );
};
submitUpload.request = submitUploadType.request;
submitUpload.success = submitUploadType.success;
submitUpload.failure = submitUploadType.failure;
