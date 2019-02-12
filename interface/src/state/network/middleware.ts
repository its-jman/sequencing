import { Middleware } from "redux";
import { NETWORK_STATUS } from "src/state/network/types";

export const APIMiddleware: Middleware = ({ dispatch, getState }) => {
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

    const networkRequest = (status: string, other = {}) => {
      return {
        type: type,
        status: status,
        payload: payload,
        ...other
      };
    };

    dispatch(networkRequest(NETWORK_STATUS.REQUEST));

    return callAPI(payload).then(
      // @ts-ignore
      (response) => dispatch(networkRequest(NETWORK_STATUS.SUCCESS, { response })),
      // @ts-ignore
      (error) => dispatch(networkRequest(NETWORK_STATUS.FAILURE, { error }))
    );
  };
};
