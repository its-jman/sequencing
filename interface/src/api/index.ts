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
