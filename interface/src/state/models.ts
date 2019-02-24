import { AnyAction, Dispatch } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { ConfirmationType, ModalType } from "src/state/actions";

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
    items: Array<ISequence>;
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
export interface IUIState {
  title: string | null;
  modalManager: IModalManager;
  fileInput: {
    shouldOpen: boolean;
    files: Array<File | null>;
  };
}

export interface INetworkAction {
  type: string;
  status: string;
  payload: any;
}
export interface INetworkState {
  actions: Array<INetworkAction>;
}
export interface IDatasetsState {
  [dataset_id: string]: IDataset;
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
