import { ISequence } from "src/state/models";

export type IFetchSequencesParams = {
  datasetId: string;
  page: number;
  queryId: string;
  descFilter: string;
};

export type IFetchSequencesResponse = {
  page: number;
  page_size: number;
  total_count: number;
  items: ISequence[];
};
