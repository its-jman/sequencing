import { NETWORK_STATUS } from "src/state/middleware";
import { Dispatch } from "redux";

export interface IAction<TPayload> {
  type: string;
  payload: TPayload;
}

export interface IActionCreator<TPayload> {
  type: string;

  create: (payload: TPayload) => IAction<TPayload>;
}

export class ActionCreator<TPayload> implements IActionCreator<TPayload> {
  type: string;

  constructor(type: string) {
    this.type = type;
  }

  create(payload: TPayload): IAction<TPayload> {
    return {
      type: this.type,
      payload: payload
    };
  }
}

const mapDispatchProps = <TPayload>(type: string, payload: TPayload) => {
  return (status: string, other: object = {}) => {
    return {
      type: type,
      status: status,
      payload: payload,
      ...other
    };
  };
};

type INetworkAction<TPayload> = {
  type: string;
  (dispatch: Dispatch): void;
};

export class NetworkActionCreator<TPayload, TResponse> {
  type: string;
  callAPI: (payload: TPayload) => Promise<object>;
  // shouldCallAPI: () => boolean;
  payload: TPayload;

  constructor(
    type: string,
    callAPI: (payload: TPayload) => Promise<object>,
    // shouldCallAPI: () => boolean = () => true,
    payload: TPayload
  ) {
    this.type = type;
    this.callAPI = callAPI;
    // this.shouldCallAPI = shouldCallAPI;
    this.payload = payload;
  }

  create(payload: TPayload): INetworkAction<TPayload> {
    // @ts-ignore
    return (dispatch) => {
      // if (!this.shouldCallAPI(getState())) {
      //   return;
      // }

      const networkRequest = mapDispatchProps(this.type, payload);

      dispatch(networkRequest(NETWORK_STATUS.REQUEST));

      return (
        this.callAPI(payload)
          //@ts-ignore
          .then((resp) => resp.json())
          .then(
            (response: object) => dispatch(networkRequest(NETWORK_STATUS.SUCCESS, { response })),
            (error: object) => dispatch(networkRequest(NETWORK_STATUS.FAILURE, { error }))
          )
      );
    };
  }
}
