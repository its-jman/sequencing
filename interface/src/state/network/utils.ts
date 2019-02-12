import { NETWORK_STATUS } from "src/state/network/types";

const defaultInitialState = {
  isFetching: false,
  data: {},
  errors: {}
};

const defaultGetResponseErrors = (response: any) => {
  if (response) {
    const data = response.data;
    if (data) {
      return data.errors;
    }
  }
};

// @ts-ignore
export const networkReducer = (state, action, config) => {
  const {
    initialState = defaultInitialState,
    clearData = false,
    transformResponse = (response: any) => response.data,
    getDataErrors = defaultGetResponseErrors,
    transformError = (error: any) => error
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
      const responseErrors = getDataErrors(action.response);
      if (responseErrors) {
        // @ts-ignore
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
        // @ts-ignore
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
