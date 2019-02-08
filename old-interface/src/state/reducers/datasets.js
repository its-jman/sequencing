import types from "../actions/types";
import { networkReducer } from "./utils";

const initialState = {
  isFetching: false,
  errors: {},
  data: { items: {} }
};

export const datasets = (state = initialState, action) => {
  switch (action.type) {
    case types.UPLOAD_DATASET:
      return networkReducer(state, action, {
        initialState: initialState,
        transformResponse: (response) => {
          if (response.status === 200) {
            return state.data;
          } else {
            console.log("NON 200 RESPONSE");
            console.log(response);
            return state.data;
          }
        }
      });
    case types.DELETE_DATASET:
      return networkReducer(state, action, {
        initialState: initialState,
        transformResponse: (response) => {
          const { [action.payload.datasetID]: deletedItem, ...newItems } = state.data.items;
          return {
            ...state.data,
            items: newItems
          };
        }
      });
    case types.LOAD_DATASETS:
      return networkReducer(state, action, {
        initialState: initialState,
        clearData: true,
        transformResponse: (response) => {
          return {
            ...state.data,
            items: response.data
          };
        }
      });
    default:
      return state;
  }
};
