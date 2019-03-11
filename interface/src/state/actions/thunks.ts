import { ISequence, IUpload, NetworkStatus, SEQUENCES_PAGE_SIZE } from "src/state/models";
import * as api from "src/api";
import { isEmpty } from "src/utils";
import { IFetchSequences, networkActions as na } from "src/state/actions/network";
import { actions, IThunkAction } from "src/state/actions";
import { ModalType } from "src/state/constants";
import { paramsMatch } from "src/state/reducers/data/sequences";

const fetchDatasets = (): IThunkAction => (dispatch, getState) => {
  const { datasets: state } = getState().data;
  if (!isEmpty(state.datasets) || state.networkStatus === NetworkStatus.SUCCESS) {
    console.warn("Fetch Datasets attempted sending while data already populated.");
    return;
  }

  dispatch(na.fetchDatasetsRequest());
  api.fetchDatasets().then(
    (response) => dispatch(na.fetchDatasetsSuccess({ items: response })),
    (error) => {
      console.error("fetchDatasetsFailure: ");
      console.error(error);
      dispatch(na.fetchDatasetsFailure());
    }
  );
};

const deleteDataset = (id: string): IThunkAction => (dispatch) => {
  dispatch(na.deleteDatasetRequest({ id }));
  api
    .deleteDataset({ id })
    .then(
      () => dispatch(na.deleteDatasetSuccess({ id })),
      (error) => dispatch(na.deleteDatasetFailure({ id }))
    );
};

const fetchSequences = (params: IFetchSequences): IThunkAction => (dispatch, getState) => {
  const { datasetId, filter, page, queryId } = params;
  const { sequences: state, datasets } = getState().data;

  if (datasetId === null) {
    console.error("datasetId is null when trying to fetch sequences. Returning.");
    return;
  }

  if (
    paramsMatch(state, params) &&
    (state.networkStatus[page] === NetworkStatus.SUCCESS ||
      state.networkStatus[page] === NetworkStatus.REQUEST)
  ) {
    console.warn("Trying to fetch sequences that already exist");
    return;
  }

  dispatch(na.fetchSequencesRequest({ params }));
  api.fetchSequences(params).then(
    (response: { page: number; page_size: number; items: ISequence[] }) => {
      const dataset = datasets.datasets[datasetId];
      const expected = Math.min(
        SEQUENCES_PAGE_SIZE,
        dataset.analysis.record_count - page * SEQUENCES_PAGE_SIZE
      );

      if (response.items.length !== expected) {
        console.warn("Fetch sequences page size does not match the expected size");
      }

      dispatch(na.fetchSequencesSuccess({ params, items: response.items }));
    },
    (error) => {
      console.error("fetchSequences error");
      console.error(error);
      dispatch(na.fetchSequencesFailure({ params, errors: error }));
    }
  );
};

const fetchAlphabet = (): IThunkAction => (dispatch, getState) => {
  const { alphabet: state } = getState().data;

  if (
    !isEmpty(state.alphabet) ||
    state.networkStatus === NetworkStatus.SUCCESS ||
    state.networkStatus === NetworkStatus.REQUEST
  ) {
    return;
  }

  dispatch(na.fetchAlphabetRequest());
  api.fetchAlphabet().then(
    (response) => dispatch(na.fetchAlphabetSuccess({ alphabet: response })),
    (error) => {
      console.error("fetchAlphabet failure: ");
      console.error(error);
      dispatch(na.fetchAlphabetFailure());
    }
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
    (upload.networkStatus === NetworkStatus.FAILURE && upload.errors.length === 0)
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
      (response) => {
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

const fetchQueries = (): IThunkAction => (dispatch, getState) => {
  const state = getState();
  if (!isEmpty(state.data.queries)) {
    return;
  }

  dispatch(na.fetchQueriesRequest());
  api.fetchQueries().then(
    (response) => {
      dispatch(na.fetchQueriesSuccess(response));
    },
    (error) => {
      console.error("Fetch Queries error");
      console.error(error);
      dispatch(na.fetchQueriesFailure());
    }
  );
};

const createQuery = (rawPattern: string): IThunkAction => (dispatch, getState) => {
  const { queries: state } = getState().data;
  if (state.history.items.filter((query) => query.raw_pattern === rawPattern).length > 0) {
    console.error("Trying to create queryId that already exists");
    return;
  }

  dispatch(na.createQueryRequest({ rawPattern }));
  api.createQuery(rawPattern).then(
    (response) => {
      dispatch(na.createQuerySuccess({ rawPattern, response: response.query }));
    },
    (errors) => {
      dispatch(na.createQueryFailure({ rawPattern, errors }));
    }
  );
};

const fetchDatasetQuery = (payload: { queryId: string; datasetId: string }): IThunkAction => (
  dispatch,
  getState
) => {
  const state = getState();
  const queryResult = state.data.queries.queries[payload.queryId];
  if (!isEmpty(queryResult) && !isEmpty(queryResult[payload.datasetId])) {
    return;
  }

  dispatch(na.fetchDatasetQueryRequest(payload));
  api.queryDataset(payload.queryId, payload.datasetId).then(
    (response) => {
      dispatch(na.fetchDatasetQuerySuccess({ ...payload, response }));
    },
    (error) => {
      console.error("Fetch dataset queryId error");
      console.error(error);
      dispatch(na.fetchDatasetQueryFailure(payload));
    }
  );
};

export const thunks = {
  fetchDatasets,
  deleteDataset,
  fetchSequences,
  fetchAlphabet,
  submitUpload,
  fetchQueries,
  createQuery
};
