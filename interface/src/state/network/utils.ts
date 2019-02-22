import { NetworkStatus } from "src/state/network/types";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { IAppState } from "src/state/models";
import { AnyAction } from "redux";

const defaultInitialState = {
  isFetching: false,
  data: {},
  errors: {}
};

type INetworkAction = {
  type: string;
  status: NetworkStatus;
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
// export const networkReducer = <TState>(state: TState, action: INetworkAction, config) => {
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
    case NetworkStatus.REQUEST:
      return {
        ...(clearData ? initialState : state),
        isFetching: true
      };
    case NetworkStatus.SUCCESS:
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
    case NetworkStatus.FAILURE:
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

type INetworkThunkProps<TState> = {
  type: string;
  callAPI: () => Promise<any>;
  shouldCallAPI?: (state: TState) => boolean;
};

export type IThunkAction<TState> = ThunkAction<void, TState, {}, AnyAction>;

export const networkActionThunk = <TState>({
  type,
  callAPI,
  shouldCallAPI = () => true
}: INetworkThunkProps<TState>): IThunkAction<TState> => {
  return (dispatch, getState) => {
    if (!shouldCallAPI(getState())) return;

    const networkAction = (status: NetworkStatus, other: object) => ({
      type,
      status,
      ...other
    });

    callAPI().then(
      (response) => dispatch(networkAction(NetworkStatus.SUCCESS, { response })),
      (error) => dispatch(networkAction(NetworkStatus.FAILURE, { error }))
    );
    // .catch((error) => dispatch(networkAction(NETWORK_STATUS.FAILURE, { error })));
  };
};

/*export const promiseThunk = <TState>(
  onResolve: () => void,
  onReject: () => void
): ThunkAction<void, TState, {}, AnyAction> => {
  return (dispatch, getState) => {
    const PStatus = new Promise<boolean>((resolve, reject) => {
      dispatch(showConfirmation(resolve, reject));
    }).then(onResolve, onReject);
  };
};*/
