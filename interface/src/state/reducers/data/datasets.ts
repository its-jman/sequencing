import produce from "immer";

import { IDataset, IDatasetsState, NetworkStatus } from "src/state/models";
import { IActionMap } from "src/state/actions";
import { getType } from "typesafe-actions";
import { networkActions } from "src/state/actions/network";
import { arrayToObject } from "src/utils";

const is: IDatasetsState = {
  networkStatus: NetworkStatus.UNSENT,
  datasets: {}
};

export default (stateRaw: IDatasetsState = is, action: IActionMap) => {
  return produce(stateRaw, (draft) => {
    switch (action.type) {
      case getType(networkActions.fetchDatasetsRequest):
        draft.networkStatus = NetworkStatus.REQUEST;
        break;
      case getType(networkActions.fetchDatasetsSuccess):
        draft.networkStatus = NetworkStatus.SUCCESS;
        draft.datasets = arrayToObject(action.payload.items);
        break;
      case getType(networkActions.fetchDatasetsFailure):
        draft.networkStatus = NetworkStatus.FAILURE;
        console.error("Fetching datasets failed");
        break;
      case getType(networkActions.submitUploadSuccess):
        draft.datasets[action.payload.dataset._id] = action.payload.dataset;
        break;
    }
  });
};
