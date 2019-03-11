import { action, ActionType, createStandardAction as csa } from "typesafe-actions";
import uuid4 from "uuid/v4";

import {
  IAlphabetState,
  IDataset,
  IDatasetQueryAnalysis,
  IQuery,
  ISequence,
  ISequenceQueryAnalysis,
  ISequencesParams,
  NetworkStatus
} from "src/state/models";

// export type IFetchSequencesParams = ISequencesParams & {
//   datasetId: string;
// };

export type IFetchSequences = ISequencesParams & {
  page: number;
};

// prettier-ignore
export const networkActions = {
  // ------------------------------------ Fetch Datasets ---------------------------------------
  fetchDatasetsRequest: csa("FETCH_DATASETS_REQUEST")(),
  fetchDatasetsSuccess: csa("FETCH_DATASETS_SUCCESS")<{ items: IDataset[] }>(),
  fetchDatasetsFailure: csa("FETCH_DATASETS_FAILURE")(),

  // -------------------------------------- Fetch Alphabet -------------------------------------
  fetchAlphabetRequest: csa("FETCH_ALPHABET_REQUEST")(),
  fetchAlphabetSuccess: csa("FETCH_ALPHABET_SUCCESS")<{ alphabet: IAlphabetState["alphabet"] }>(),
  fetchAlphabetFailure: csa("FETCH_ALPHABET_FAILURE")(),

  // ------------------------------------ Fetch Queries ----------------------------------------
  fetchQueriesRequest: csa("FETCH_QUERIES_REQUEST")(),
  fetchQueriesSuccess: csa("FETCH_QUERIES_SUCCESS")<{ items: IQuery[] }>(),
  fetchQueriesFailure: csa("FETCH_QUERIES_FAILURE")(),

  // --------------------------------------- Fetch Sequences -----------------------------------
  fetchSequencesRequest: csa("FETCH_SEQUENCES_REQUEST")<{ params: IFetchSequences }>(),
  fetchSequencesSuccess: csa("FETCH_SEQUENCES_SUCCESS")<{ params: IFetchSequences; items: ISequence[] }>(),
  fetchSequencesFailure: csa("FETCH_SEQUENCES_FAILURE")<{ params: IFetchSequences; errors: string[] }>(),

  // ------------------------------------- Delete Dataset --------------------------------------
  deleteDatasetRequest: csa("DELETE_DATASET_REQUEST")<{ id: string }>(),
  deleteDatasetSuccess: csa("DELETE_DATASET_SUCCESS")<{ id: string }>(),
  deleteDatasetFailure: csa("DELETE_DATASET_FAILURE")<{ id: string }>(),

  // ------------------------------------ Submit Upload ----------------------------------------
  submitUploadRequest: csa("SUBMIT_UPLOAD_REQUEST")<{ i: number; }>(),
  submitUploadSuccess: csa("SUBMIT_UPLOAD_SUCCESS")<{ i: number; dataset: IDataset }>(),
  submitUploadFailure: csa("SUBMIT_UPLOAD_FAILURE")<{ i: number; errors: string[] }>(),

  // ------------------------------------ Create Query ----------------------------------------
  createQueryRequest: csa("CREATE_QUERY_REQUEST")<{ rawPattern: string }>(),
  createQuerySuccess: csa("CREATE_QUERY_SUCCESS")<{ rawPattern: string; response: IQuery }>(),
  createQueryFailure: csa("CREATE_QUERY_FAILURE")<{ rawPattern: string; errors: string[] }>(),

  // -------------------------------- Fetch Dataset Query -------------------------------------
  fetchDatasetQueryRequest: csa("FETCH_DATASET_QUERY_REQUEST")<{ datasetId: string; queryId: string }>(),
  fetchDatasetQuerySuccess: csa("FETCH_DATASET_QUERY_SUCCESS")<{ datasetId: string; queryId: string; response: IDatasetQueryAnalysis; }>(),
  fetchDatasetQueryFailure: csa("FETCH_DATASET_QUERY_FAILURE")<{ datasetId: string; queryId: string; }>(),
};
