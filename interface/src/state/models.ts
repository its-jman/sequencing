import { AnyAction } from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { ConfirmationType, ModalType } from "src/state/constants";

export enum NetworkStatus {
  UNSENT = "UNSENT",
  REQUEST = "REQUEST",
  SUCCESS = "SUCCESS",
  FAILURE = "FAILURE"
}

export const SEQUENCES_PAGE_SIZE = 40;

export interface IQuery {
  _id: string;
  raw_pattern: string;
  pattern: string;
}

export type IMatch = [number, number];
export type ISequenceQueryAnalysis = {
  matches: IMatch[];
};

export type IDatasetQueryAnalysis = {
  total_matches: number;
};

export interface ISequence {
  _id: string;
  id: string;
  description: string;
  sequence: string;
  discarded?: boolean;
  analysis: {
    distribution: object;
    amino_count: number;
  };
}

export interface IDataset {
  _id: string;
  selected: boolean;
  name: string;
  user_filename: string;
  upload_time: string;
  analysis: {
    distribution: { [letter: string]: number };
    record_count: number;
    discarded_count: number;
    amino_count: number;
  };
  sequences?: {
    page: number;
    sort_by: string;
    items: ISequence[];
  };
}

// UI State
export type IModalManager = {
  modal: { type: ModalType } | null;
  confirmations: Array<{ type: ConfirmationType; params: IConfirmationParams }>;
};
export type IConfirmationParams = {
  resolve: () => void;
  reject: () => void;
};
export type IUpload = {
  file: File;
  networkStatus: NetworkStatus;
  name: string;
  errors: string[];
  ignored?: boolean;
};
export type IUIState = {
  title: string | null;
  queryId: string | null;
  modalManager: IModalManager;
  uploadManager: {
    shouldOpenFI: boolean;
    upload: IUpload | null;
  };
};

// export type INetworkState = {
//   datasets: NetworkStatus;
//   alphabet: NetworkStatus;
//   sequences: {
//     datasetId: string;
//     queryId: string;
//     filter: string;
//     pages: {
//       [page: number]: NetworkStatus;
//     };
//   };
// };

export type IDatasetsState = {
  networkStatus: NetworkStatus;
  datasets: {
    [id: string]: IDataset;
  };
};

export type IAlphabetState = {
  networkStatus: NetworkStatus;
  alphabet: {
    [letter: string]: { abr: string; name: string; freq: number };
  };
};

export type ISequencesParams = {
  datasetId: string | null;
  queryId: string | null;
  filter: string | null;
};

export type ISequencesState = ISequencesParams & {
  networkStatus: {
    [page: number]: NetworkStatus;
  };
  pages: {
    [page: number]: ISequence[];
  };
};

export type IQueriesState = {
  history: {
    networkStatus: NetworkStatus;
    items: IQuery[];
  };
  creationNetworkStatus: {
    [rawPattern: string]: NetworkStatus;
  };
  resultsNetworkStatus: {
    [queryId: string]: NetworkStatus;
  };
  queries: {
    [queryId: string]: {
      [datasetId: string]: IDatasetQueryAnalysis;
    };
  };
};

export type IDataState = {
  alphabet: IAlphabetState;
  datasets: IDatasetsState;
  sequences: ISequencesState;
  queries: IQueriesState;
};

// App State
export type IAppState = {
  ui: IUIState;
  data: IDataState;
};

// Connect Props
export type IStateProps = {
  state: IAppState;
};

export type IDispatchProps = {
  dispatch: ThunkDispatch<IAppState, {}, AnyAction>;
};

export type IAppProps = IStateProps & IDispatchProps;
