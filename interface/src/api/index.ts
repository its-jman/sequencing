const ENDPOINT = "http://localhost:5000";

export const fetchDatasets = () => fetch(`${ENDPOINT}/datasets`).then((resp) => resp.json());
export const deleteDataset = (_id: string) =>
  fetch(`${ENDPOINT}/datasets/${_id}`, { method: "DELETE" }).then((resp) => resp.json());
