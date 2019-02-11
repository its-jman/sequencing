const ENDPOINT = "http://localhost:5000";

export const fetchDatasets = () => fetch(`${ENDPOINT}/datasets`);
