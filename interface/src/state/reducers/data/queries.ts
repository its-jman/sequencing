import produce from "immer";
import { getType } from "typesafe-actions";

import { IActionMap } from "src/state/actions";
import { networkActions as na } from "src/state/actions/network";
import { IQueriesState, NetworkStatus } from "src/state/models";

const is: IQueriesState = {
  history: {
    networkStatus: NetworkStatus.UNSENT,
    items: []
  },
  creationNetworkStatus: {},
  resultsNetworkStatus: {},
  queries: {}
};

export default (stateRaw: IQueriesState = is, action: IActionMap) => {
  return produce(stateRaw, (draft) => {
    switch (action.type) {
      // Fetch Queries
      case getType(na.fetchQueriesRequest):
        if (
          draft.history.networkStatus === NetworkStatus.SUCCESS ||
          draft.history.networkStatus === NetworkStatus.REQUEST
        ) {
          console.warn("fetchQueries that have already been requested. Ignoring.");
        } else {
          draft.history.networkStatus = NetworkStatus.REQUEST;
        }
        break;
      case getType(na.fetchQueriesSuccess):
        if (draft.history.networkStatus !== NetworkStatus.REQUEST) {
          console.warn("Recieved fetchQueriesSuccess with networkStatus !== request. Ignoring.");
        } else {
          draft.history.networkStatus = NetworkStatus.SUCCESS;
          draft.history.items = action.payload.items;
        }
        break;
      case getType(na.fetchQueriesFailure):
        if (draft.history.networkStatus !== NetworkStatus.REQUEST) {
          console.warn("Recieved fetchQueriesFailure with networkStatus !== request. Ignoring.");
        } else {
          draft.history.networkStatus = NetworkStatus.FAILURE;
        }
        break;
      // Query Creation
      case getType(na.createQueryRequest):
        if (
          action.payload.rawPattern in draft.creationNetworkStatus &&
          draft.creationNetworkStatus[action.payload.rawPattern] !== NetworkStatus.UNSENT
        ) {
          console.warn("createQuery with rawPattern that has already been requested. Ignoring");
        } else {
          draft.creationNetworkStatus[action.payload.rawPattern] = NetworkStatus.REQUEST;
        }
        break;
      case getType(na.createQuerySuccess):
        if (
          action.payload.rawPattern in draft.creationNetworkStatus &&
          draft.creationNetworkStatus[action.payload.rawPattern] !== NetworkStatus.REQUEST
        ) {
          console.warn("Recieved createQuerySuccess with networkStatus !== request. Ignoring.");
        } else {
          draft.creationNetworkStatus[action.payload.rawPattern] = NetworkStatus.SUCCESS;
          draft.history.items.push(action.payload.response);
        }
        break;
      case getType(na.createQueryFailure):
        break;
    }
  });
};
