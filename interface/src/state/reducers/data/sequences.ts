import produce from "immer";
import { getType } from "typesafe-actions";

import { ISequencesFilter, ISequencesState, NetworkStatus } from "src/state/models";
import { IActionMap } from "src/state/actions";
import { networkActions } from "src/state/actions/network";

const is: ISequencesState = {
  datasetId: null,
  queryId: null,
  filter: null,

  total_count: -1,
  networkStatus: {},
  pages: {}
};

export const paramsMatch = (params: ISequencesFilter, draft: ISequencesFilter) =>
  params.datasetId === draft.datasetId &&
  params.filter === draft.filter &&
  params.queryId === draft.queryId;

export default (stateRaw: ISequencesState = is, action: IActionMap) => {
  let params;
  return produce(stateRaw, (draft) => {
    switch (action.type) {
      // Fallthrough to handle duplication
      // case getType(networkActions.fetchSequencesRequest):
      // case getType(networkActions.fetchSequencesSuccess):
      // case getType(networkActions.fetchSequencesFailure):
      //   break;
      case getType(networkActions.fetchSequencesRequest):
        ({ params } = action.payload);
        if (!paramsMatch(params, draft)) {
          console.warn("Clearing sequences state: Params do not match. ");
          draft.datasetId = params.datasetId;
          draft.queryId = params.queryId;
          draft.filter = params.filter;

          draft.total_count = -1;
          draft.networkStatus = {};
          draft.pages = {};
        }

        // Set network networkStatus for page.
        if (
          params.page in draft.networkStatus &&
          draft.networkStatus[params.page] !== NetworkStatus.FAILURE
        ) {
          console.warn("Requesting sequences page that is already being requested.");
        } else {
          draft.networkStatus[params.page] = NetworkStatus.REQUEST;
        }
        break;
      case getType(networkActions.fetchSequencesSuccess):
        ({ params } = action.payload);
        if (!paramsMatch(params, draft)) {
          console.warn("Recieved fetchSequencesSuccess with non-matching params. Ignoring.");
        } else {
          if (
            params.page in draft.networkStatus &&
            draft.networkStatus[params.page] !== NetworkStatus.REQUEST
          ) {
            console.warn(
              "Recieved fetchSequencesSuccess with networkStatus !== request. Ignoring."
            );
          } else {
            draft.networkStatus[params.page] = NetworkStatus.SUCCESS;
            draft.pages[params.page] = action.payload.response.items;

            if (
              draft.total_count !== -1 &&
              draft.total_count !== action.payload.response.total_count
            ) {
              console.error("UNEXPECTED TOTAL COUNT RECIEVED. Proceeding as if nothing happened..");
            }
            draft.total_count = action.payload.response.total_count;
          }
        }
        break;
      case getType(networkActions.fetchSequencesFailure):
        ({ params } = action.payload);
        if (!paramsMatch(params, draft)) {
          console.warn("Recieved fetchSequencesFailure with non-matching params. Ignoring.");
        } else {
          if (
            params.page in draft.networkStatus &&
            draft.networkStatus[params.page] !== NetworkStatus.REQUEST
          ) {
            console.warn(
              "Recieved fetchSequencesFailure with networkStatus !== request. Ignoring."
            );
          } else {
            draft.networkStatus[params.page] = NetworkStatus.FAILURE;
          }
        }
        break;
    }
  });
};
