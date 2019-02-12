import { Dispatch } from "redux";

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
  sequences?: {
    page: number;
    sort_by: string;
    items: Array<ISequence>;
  };
};

export type IContextState = {
  title: string | undefined;
};

export type IDatasetsState = {
  [dataset_id: string]: IDataset;
};

export type IAppState = {
  context: IContextState;
  datasets: IDatasetsState;
};

export type IStateProps = {
  state: IAppState;
};

export type IDispatchProps = {
  dispatch: Dispatch;
};

export type IAppProps = IStateProps & IDispatchProps;
