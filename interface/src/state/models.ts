export const DATASETS_NETWORK_PAGE_SIZE = 40;

export enum NetworkStatus {
  UNSENT = "UNSENT",
  REQUEST = "REQUEST",
  SUCCESS = "SUCCESS",
  FAILURE = "FAILURE"
}

export interface IQuery {
  _id: string;
  raw_pattern: string;
}

export type IMatch = [number, number];
export type ISequenceQueryAnalysis = {
  matches: IMatch[];
};

export type IDatasetQueryAnalysis = {
  total_matches: number;
};

export interface IRecord {
  _id: string;
  seq_id: string;
  description: string;
  sequence: string;
  discarded?: boolean;
  match_score?: number;
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
  upload_time: Date;
  analysis: {
    distribution: { [letter: string]: number };
    record_count: number;
    discarded_count: number;
    amino_count: number;
  };
  sequences?: {
    page: number;
    sort_by: string;
    items: IRecord[];
  };
}

export type IUpload = {
  file: File;
  ns: NetworkStatus;
  name: string;
  errors: string[];
  ignored?: boolean;
};

type IAlphabetLetter = { abr: string; name: string; freq: number };
export type IAlphabet = { [letter: string]: IAlphabetLetter };

// HERE
export type IFilter = {
  queryId: string | null;
  descFilter: string | null;
};
