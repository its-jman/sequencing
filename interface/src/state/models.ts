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
