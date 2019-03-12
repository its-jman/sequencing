import {
  IAlphabetState,
  IDataset,
  IQuery,
  ISequence,
  IUpload,
  NETWORK_PAGE_SIZE
} from "src/state/models";
import { isEmpty } from "src/utils";
import { IFetchSequencesParams } from "src/state/actions/network";
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

export const fetchDatasets = () =>
  fetch(`${ENDPOINT}/datasets`).then((resp): Promise<IDataset[]> => resp.json());
export const deleteDataset = ({ id }: { id: string }) =>
  fetch(`${ENDPOINT}/datasets/${id}`, { method: "DELETE" });

export const fetchAlphabet = () =>
  fetch(`${ENDPOINT}/alphabet`).then((resp): Promise<IAlphabetState["alphabet"]> => resp.json());

export const fetchSequences = ({ datasetId, page, queryId, filter }: IFetchSequencesParams) => {
  let url = `${ENDPOINT}/datasets/${datasetId}/sequences`;
  const queryParams: IQueryString = {
    page: `${page}`,
    page_size: `${NETWORK_PAGE_SIZE}`
  };
  if (queryId !== null) queryParams["qid"] = queryId;
  if (filter !== null) queryParams["filter"] = filter;

  return fetch(withParams(url, queryParams)).then(
    (resp): Promise<IFetchSequencesResponse> => resp.json()
  );
};

export const submitUpload = (upload: IUpload) => {
  const form = new FormData();
  form.append("name", upload.name);
  form.append("file", upload.file);

  return fetch(`${ENDPOINT}/datasets`, {
    method: "POST",
    // headers: { "Content-Type": "multipart/form-dataset" },
    body: form
  }).then((resp): Promise<{ errors: string[]; dataset: IDataset | null }> => resp.json());
};

export const fetchQueries = () =>
  fetch(`${ENDPOINT}/queries`).then((resp): Promise<{ items: IQuery[] }> => resp.json());

export const createQuery = (rawPattern: string) =>
  fetch(`${ENDPOINT}/queries`, {
    method: "POST",
    body: JSON.stringify({ raw_pattern: rawPattern })
  }).then((resp): Promise<{ errors: string[]; query: IQuery }> => resp.json());

export const queryDataset = (queryId: string, datasetId: string) =>
  fetch(`${ENDPOINT}/queries/${queryId}/datasets/${datasetId}`).then((resp) => resp.json());
