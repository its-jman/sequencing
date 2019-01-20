import { NETWORK_STATUS } from "../actions/types";

const defaultInitialState = {
  isFetching: false,
  data: {},
  errors: {}
};

export const networkReducer = (state, action, config) => {
  const {
    initialState = defaultInitialState,
    clearData = false,
    transformResponse = (response) => response.data,
    getDataErrors: getResponseErrors = (response) => response.data.errors,
    transformError = (error) => error
  } = config;

  let errors = {};

  switch (action.status) {
    case NETWORK_STATUS.REQUEST:
      return {
        ...(clearData ? initialState : state),
        isFetching: true
      };
    case NETWORK_STATUS.SUCCESS:
      const data = transformResponse(action.response);
      const responseErrors = getResponseErrors(action.response);
      if (responseErrors) {
        errors["response_errors"] = responseErrors;
      }

      // Fallthrough if there are errors
      if (Object.keys(errors).length === 0) {
        return {
          isFetching: false,
          data: data,
          errors: clearData ? initialState.errors : state.errors
        };
      }
    case NETWORK_STATUS.FAILURE:
      const requestErrors = transformError(action.error);
      if (requestErrors) {
        errors["request_errors"] = requestErrors;
      }

      return {
        isFetching: false,
        data: initialState.data,
        errors: errors
      };
    default:
      return state;
  }
};
