import { AnyAction } from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { ConfirmationType, ModalType } from "src/state/constants";

export enum NetworkStatus {
  UNSENT = "UNSENT",
  REQUEST = "REQUEST",
  SUCCESS = "SUCCESS",
  FAILURE = "FAILURE"
}

export interface ISequence {
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
export interface IModalManager {
  modal: { type: ModalType } | null;
  confirmations: Array<{ type: ConfirmationType; params: IConfirmationParams }>;
}
export interface IConfirmationParams {
  resolve: () => void;
  reject: () => void;
}
export interface IUpload {
  file: File;
  status: NetworkStatus;
  name: string;
  errors: string[];
  ignored?: boolean;
}
export interface IUIState {
  title: string | null;
  modalManager: IModalManager;
  uploadManager: {
    shouldOpenFI: boolean;
    upload: IUpload | null;
  };
}

export interface INetworkState {
  datasets: NetworkStatus;
  alphabet: NetworkStatus;
}

export interface IDatasetsState {
  [id: string]: IDataset;
}

export interface IAlphabetState {
  [letter: string]: { abr: string; name: string; freq: number };
}

export interface IDataState {
  network: INetworkState;
  datasets: IDatasetsState;
  alphabet: IAlphabetState;
}

// App State
export interface IAppState {
  ui: IUIState;
  data: IDataState;
}

// Connect Props
export interface IStateProps {
  state: IAppState;
}

export interface IDispatchProps {
  dispatch: ThunkDispatch<IAppState, {}, AnyAction>;
}

export interface IAppProps extends IStateProps, IDispatchProps {}
