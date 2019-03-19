import {
  DATASETS_NETWORK_PAGE_SIZE,
  IAlphabet,
  IDataset,
  IFilter,
  IQuery,
  IUpload
} from "src/state/models";
import { isEmpty } from "src/utils";
import { IFetchSequencesResponse } from "src/api/models";

const ENDPOINT = "http://localhost:5000";
const esc = encodeURIComponent;
type IQueryString = { [k: string]: string };

const withParams = (url: string, params: IQueryString): string => {
  const urlParams = Object.entries(params)
    .map(([k, v]) => `${esc(k)}=${esc(v)}`)
    .join("&");

  return `${url}${isEmpty(params) ? "" : `?${urlParams}`}`;
};

const fetchDatasets = () =>
  fetch(`${ENDPOINT}/datasets`).then((resp): Promise<IDataset[]> => resp.json());
const deleteDataset = ({ id }: { id: string }) =>
  fetch(`${ENDPOINT}/datasets/${id}`, { method: "DELETE" });

const fetchAlphabet = () =>
  fetch(`${ENDPOINT}/alphabet`).then((resp): Promise<IAlphabet> => resp.json());

const fetchSequences = (
  datasetId: string,
  page: number,
  filter: IFilter,
  pageSize: number = DATASETS_NETWORK_PAGE_SIZE
) => {
  let url = `${ENDPOINT}/datasets/${datasetId}/sequences`;
  const queryParams: IQueryString = {
    page: `${page}`,
    page_size: `${pageSize}`
  };
  if (filter.queryId !== null) queryParams["qid"] = filter.queryId;
  if (filter.descFilter !== null) queryParams["filter"] = filter.descFilter;

  return fetch(withParams(url, queryParams))
    .then((resp): Promise<IFetchSequencesResponse> => resp.json())
    .then((response) => {
      let expected = pageSize;
      const maxPage = Math.ceil(response.total_count / pageSize) - 1;
      if (page === maxPage) {
        expected = response.total_count % pageSize;
      }
      // const expected = Math.min(NETWORK_PAGE_SIZE, response.total_count - page * NETWORK_PAGE_SIZE);

      if (response.items.length !== expected) {
        console.groupCollapsed(
          "%cfetchSequences: Page size does not match expected size",
          "color: #E6C78A; background-color: #332B00; font-size: 12px; font-weight: lighter; padding: 3px; border: 1px solid #E6C78A"
        );
        console.log("Expected: ", expected);
        console.log("Actual: ", response.items.length);
        console.groupEnd();
      }
      return response;
    });
};

const submitUpload = (upload: IUpload) => {
  const form = new FormData();
  form.append("name", upload.name);
  form.append("file", upload.file);

  return fetch(`${ENDPOINT}/datasets`, {
    method: "POST",
    // headers: { "Content-Type": "multipart/form-dataset" },
    body: form
  }).then((resp): Promise<{ errors: string[]; dataset: IDataset | null }> => resp.json());
};

const fetchQueriesHistory = () =>
  fetch(`${ENDPOINT}/queries`).then((resp): Promise<IQuery[]> => resp.json());

const createQuery = (rawPattern: string) =>
  fetch(`${ENDPOINT}/queries`, {
    method: "POST",
    body: JSON.stringify({ raw_pattern: rawPattern })
  }).then((resp): Promise<{ errors: string[]; query: IQuery }> => resp.json());

const queryDataset = (queryId: string, datasetId: string) =>
  fetch(`${ENDPOINT}/queries/${queryId}/datasets/${datasetId}`).then((resp) => resp.json());

export const api = {
  fetchDatasets,
  deleteDataset,
  fetchAlphabet,
  fetchSequences,
  submitUpload,
  fetchQueriesHistory,
  createQuery,
  queryDataset
};
