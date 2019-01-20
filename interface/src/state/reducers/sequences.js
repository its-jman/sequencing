import types from "../actions/types";
import { networkReducer } from "./utils";

const initialState = {
  isFetching: false,
  data: { datasetID: "", records: {}, matches: {} },
  errors: {}
};

export const sequences = (state = initialState, action) => {
  switch (action.type) {
    case types.LOAD_DATASET_SEQUENCES:
      return networkReducer(state, action, {
        initialState: initialState,
        shouldCallAPI: state.data.datasetID !== action.payload.datasetID,
        transformResponse: (response) => {
          const doesMatch = state.data.datasetID === response.data.dataset_id;

          return {
            ...(doesMatch ? state.data : initialState.data),
            datasetID: response.data.dataset_id,
            records: response.data.records
          };
        }
      });
    case types.LOAD_QUERY_MATCHES:
      return networkReducer(state, action, {
        initialState: initialState,
        shouldCallAPI: state.data.datasetID !== action.payload.datasetID,
        transformResponse: (response) => {
          const doesMatch = state.data.datasetID === response.data.dataset_id;

          return {
            ...(doesMatch ? state.data : initialState.data),
            datasetID: response.data.dataset_id,
            matches: response.data.matches
          };
        }
      });
    case types.CLEAR_QUERY:
      return {
        ...state,
        data: {
          ...state.data,
          matches: {}
        }
      };
    default:
      return state;
  }
};
