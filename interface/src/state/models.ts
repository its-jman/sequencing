import { AnyAction, Dispatch } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { ConfirmationType, ModalType } from "src/state/actions";

export type ISequence = {
  description: string;
  sequence: string;
  discarded?: boolean;
  analysis: {
    distribution: object;
    amino_count: number;
  };
};

export type IDataset = {
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
    items: Array<ISequence>;
  };
};

type INetworkState<TData> = {
  isFetching: boolean;
  errors: object;
  data: TData;
};

// UI State
export type IModalManager = {
  modal: { type: ModalType } | null;
  confirmations: Array<{ type: ConfirmationType; params: IConfirmationParams }>;
};
export type IConfirmationParams = { resolve: () => void; reject: () => void };
export type IUIState = {
  title: string | null;
  modalManager: IModalManager;
};

// Datasets State
export type IDatasetsStateData = {
  [dataset_id: string]: IDataset;
};
export type IDatasetsState = INetworkState<IDatasetsStateData>;

// Alphabet State
export type IAlphabetDetails = {
  [letter: string]: { abr: string; name: string; freq: number };
};
export type IAlphabetState = INetworkState<IAlphabetDetails>;

// Upload/Files state
export type IUploadState = {
  fileInput: HTMLInputElement | null;
  files: Array<File | null>;
};

// App State
export type IAppState = {
  ui: IUIState;
  datasets: IDatasetsState;
  alphabet: IAlphabetState;
  upload: IUploadState;
};

// Connect Props
export type IStateProps = {
  state: IAppState;
};

export type IDispatchProps = {
  dispatch: ThunkDispatch<IAppState, {}, AnyAction>;
};

export type IAppProps = IStateProps & IDispatchProps;
