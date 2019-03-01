import { action, ActionType, createStandardAction as csa } from "typesafe-actions";
import uuid4 from "uuid/v4";

import { IAlphabetState, IDataset, ISequence, NetworkStatus } from "src/state/models";

// prettier-ignore
export const networkActions = {
  // ------------------------------------ Fetch Datasets ---------------------------------------
  fetchDatasetsRequest: csa("FETCH_DATASETS_REQUEST")(),
  fetchDatasetsSuccess: csa("FETCH_DATASETS_SUCCESS")<IDataset[]>(),
  fetchDatasetsFailure: csa("FETCH_DATASETS_FAILURE")<{ error: any }>(),

  // --------------------------------------- Fetch Sequences -----------------------------------
  fetchSequencesRequest: csa("FETCH_SEQUENCES_REQUEST")<{ id: string;page: number }>(),
  fetchSequencesSuccess: csa("FETCH_SEQUENCES_SUCCESS")<{ id: string;page: number; sequences: ISequence[] }>(),
  fetchSequencesFailure: csa("FETCH_SEQUENCES_FAILURE")<{ id: string; page: number; error: any }>(),

  // -------------------------------------- Fetch Alphabet -------------------------------------
  fetchAlphabetRequest: csa("FETCH_ALPHABET_REQUEST")(),
  fetchAlphabetSuccess: csa("FETCH_ALPHABET_SUCCESS")<IAlphabetState>(),
  fetchAlphabetFailure: csa("FETCH_ALPHABET_FAILURE")<{ errors: any }>(),

  // ------------------------------------- Delete Dataset --------------------------------------
  deleteDatasetRequest: csa("DELETE_DATASET_REQUEST")<{ id: string }>(),
  deleteDatasetSuccess: csa("DELETE_DATASET_SUCCESS")<{ id: string }>(),
  deleteDatasetFailure: csa("DELETE_DATASET_FAILURE")<{ id: string; error: any }>(),

  // ------------------------------------ Submit Upload ----------------------------------------
  submitUploadRequest: csa("SUBMIT_UPLOAD_REQUEST")<{ i: number; }>(),
  submitUploadSuccess: csa("SUBMIT_UPLOAD_SUCCESS")<{ i: number; dataset: IDataset }>(),
  submitUploadFailure: csa("SUBMIT_UPLOAD_FAILURE")<{ i: number; errors: string[] }>()
};
