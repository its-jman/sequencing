import types from "../actions/types";
import { networkReducer } from "./utils";

const initialState = {
  isFetching: false,
  errors: {},
  data: { items: {}, rawPattern: "", regex: "" }
};

export const query = (state = initialState, action) => {
  switch (action.type) {
    case types.LOAD_QUERY:
      return networkReducer(state, action, {
        initialState: initialState,
        clearData: true,
        transformResponse: (response) => {
          return {
            items: response.data.matches,
            rawPattern: response.data.raw_pattern,
            regex: response.data.regex
          };
        }
      });
    case types.CLEAR_QUERY:
      return initialState;
    default:
      return state;
  }
};
