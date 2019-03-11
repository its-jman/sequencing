import { IAlphabetState, NetworkStatus } from "src/state/models";
import produce from "immer";
import { IActionMap } from "src/state/actions";
import { getType } from "typesafe-actions";
import { networkActions } from "src/state/actions/network";

const is: IAlphabetState = {
  networkStatus: NetworkStatus.UNSENT,
  alphabet: {}
};

export default (stateRaw: IAlphabetState = is, action: IActionMap) => {
  return produce(stateRaw, (draft) => {
    switch (action.type) {
      case getType(networkActions.fetchAlphabetRequest):
        draft.networkStatus = NetworkStatus.REQUEST;
        break;
      case getType(networkActions.fetchAlphabetSuccess):
        draft.networkStatus = NetworkStatus.SUCCESS;
        draft.alphabet = action.payload.alphabet;
        break;
      case getType(networkActions.fetchAlphabetFailure):
        draft.networkStatus = NetworkStatus.FAILURE;
        console.error("Fetching alphabet failed");
        break;
    }
  });
};
