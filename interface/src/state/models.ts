import { AnyAction, Dispatch } from "redux";
import { ThunkDispatch } from "redux-thunk";

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

type IUploadState = {
  files: Array<File>;
  currentUpload: number;
};

type INetworkState<TData> = {
  isFetching: boolean;
  errors: object;
  data: TData;
};

export type IContextState = {
  title: string | undefined;
};

export type IDatasetsStateData = {
  [dataset_id: string]: IDataset;
};

export type IAlphabetDetails = {
  [letter: string]: { abr: string; name: string; freq: number };
};

export type IDatasetsState = INetworkState<IDatasetsStateData>;
export type IAlphabetState = INetworkState<IAlphabetDetails>;

export type IAppState = {
  context: IContextState;
  datasets: IDatasetsState;
  alphabet: IAlphabetState;
  upload: IUploadState;
};

export type IStateProps = {
  state: IAppState;
};

export type IDispatchProps = {
  dispatch: ThunkDispatch<IAppState, {}, AnyAction>;
};

export type IAppProps = IStateProps & IDispatchProps;
