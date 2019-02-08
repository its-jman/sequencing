import { NETWORK_STATUS } from "./actions/types";

const mapDispatchProps = (type, payload) => {
  return (status, other) => {
    return {
      type: type,
      status: status,
      payload: payload,
      ...other
    };
  };
};

export function APIMiddleware({ dispatch, getState }) {
  return (next) => (action) => {
    if (!action.apiRequest) {
      // Normal action: pass it on
      return next(action);
    }

    const { type, callAPI, shouldCallAPI = () => true, payload = {} } = action;

    if (typeof callAPI !== "function") {
      throw new Error("Expected callAPI to be a function.");
    }

    if (!shouldCallAPI(getState())) {
      return;
    }

    const networkRequest = mapDispatchProps(type, payload);

    dispatch(networkRequest(NETWORK_STATUS.REQUEST));

    return callAPI(payload).then(
      (response) => dispatch(networkRequest(NETWORK_STATUS.SUCCESS, { response })),
      (error) => dispatch(networkRequest(NETWORK_STATUS.FAILURE, { error }))
    );
  };
}
