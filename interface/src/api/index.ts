import { IUpload, SEQUENCES_PAGE_SIZE } from "src/state/models";

const ENDPOINT = "http://localhost:5000";

export const fetchDatasets = () => fetch(`${ENDPOINT}/datasets`).then((resp) => resp.json());
export const deleteDataset = ({ id }: { id: string }) =>
  fetch(`${ENDPOINT}/datasets/${id}`, { method: "DELETE" });

export const fetchAlphabet = () => fetch(`${ENDPOINT}/alphabet`).then((resp) => resp.json());
export const fetchSequences = (payload: { id: string; page: number }) =>
  fetch(
    `${ENDPOINT}/datasets/${payload.id}/sequences?page=${
      payload.page
    }&page_size=${SEQUENCES_PAGE_SIZE}`
  ).then((resp) => resp.json());

export const submitUpload = (upload: IUpload) => {
  const form = new FormData();
  form.append("name", upload.name);
  form.append("file", upload.file);

  return fetch(`${ENDPOINT}/datasets`, {
    method: "POST",
    // headers: { "Content-Type": "multipart/form-dataset" },
    body: form
  }).then((resp) => resp.json());
};

export const createQuery = (rawPattern: string) =>
  fetch(`${ENDPOINT}/query`, {
    method: "POST",
    body: JSON.stringify({ raw_pattern: rawPattern })
  }).then((resp) => resp.json());

export const queryDataset = (queryId: string, datasetId: string) =>
  fetch(`${ENDPOINT}/query/${queryId}/datasets/${datasetId}`).then((resp) => resp.json());

export const queryDatasetSequences = (queryId: string, datasetId: string) =>
  fetch(`${ENDPOINT}/query/${queryId}/datasets/${datasetId}/sequences`).then((resp) => resp.json());
