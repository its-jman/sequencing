import { IRecord } from "src/state/models";

export type IFetchSequencesResponse = {
  page: number;
  page_size: number;
  total_count: number;
  items: IRecord[];
};
