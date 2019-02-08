import DefaultAxios from "axios";

// TODO: Figure out a non-dumb way to do this.
export const apiController = DefaultAxios.create({
  baseURL: "http://127.0.0.1:5000/",
  headers: {
    "Content-Type": "application/json"
  }
});

export const urls = {
  datasets: {
    get: ({ datasetID }) => {
      let endpoint = `/datasets`;
      if (datasetID) {
        endpoint = `${endpoint}/${datasetID}`;
      }
      return endpoint;
    }
  }
};

export default {
  datasets: {
    post: ({ data }) => {
      return apiController.post(`/datasets`, data, {
        headers: { "Content-Type": "multipart/form-dataset" }
      });
    },
    get: ({ datasetID }) => {
      let endpoint = `/datasets`;
      if (datasetID) {
        endpoint = `${endpoint}/${datasetID}`;
      }
      return apiController.get(endpoint);
    },
    getSequences: ({ datasetID }) => apiController.get(`/datasets/${datasetID}/sequences`),
    delete: ({ datasetID }) => apiController.delete(`/datasets/${datasetID}`)
  },
  search: {
    get: ({ rawPattern, datasetID }) => {
      const urlPattern = encodeURIComponent(rawPattern);
      let endpoint = `/search/${urlPattern}/datasets`;
      if (datasetID) {
        endpoint = `${endpoint}/${datasetID}`;
      }
      return apiController.get(endpoint);
    },
    getSequences: ({ rawPattern, datasetID }) => {
      const urlPattern = encodeURIComponent(rawPattern);
      return apiController.get(`/search/${urlPattern}/datasets/${datasetID}/sequences`);
    }
  }
};
