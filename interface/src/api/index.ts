const ENDPOINT = "http://localhost:5000";

export const fetchDatasets = () => fetch(`${ENDPOINT}/datasets`).then((resp) => resp.json());
export const deleteDataset = ({ _id }: { _id: string }) =>
  fetch(`${ENDPOINT}/datasets/${_id}`, { method: "DELETE" });

export const fetchAlphabet = () => fetch(`${ENDPOINT}/alphabet`).then((resp) => resp.json());
export const fetchSequences = ({ _id }: { _id: string }) =>
  fetch(`${ENDPOINT}/datasets/${_id}/sequences`).then((resp) => resp.json());

export const submitUpload = ({ name, file }: { name: string; file: File }) => {
  const form = new FormData();
  form.append("name", name);
  form.append("file", file);

  return fetch(`${ENDPOINT}/datasets`, {
    method: "POST",
    // headers: { "Content-Type": "multipart/form-dataset" },
    body: form
  }).then((resp) => resp.json());
};
