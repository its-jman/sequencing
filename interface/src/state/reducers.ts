import { combineReducers } from "redux";
import { getType } from "typesafe-actions";
import produce from "immer";

import { actions, IActionMap } from "src/state/actions";
import { networkActions } from "src/state/actions/network";
import { IAppState, IDataset, NetworkStatus } from "src/state/models";

const initialUIState: IAppState["ui"] = {
  title: null,
  modalManager: {
    modal: null,
    confirmations: []
  },
  uploadManager: {
    shouldOpenFI: false,
    upload: null
  }
};

const initialDataState: IAppState["data"] = {
  network: {
    datasets: NetworkStatus.UNSENT,
    alphabet: NetworkStatus.UNSENT
  },
  datasets: {},
  alphabet: {}
};

/* tslint:disable:switch-default */
export default combineReducers<IAppState>({
  ui: (stateRaw: IAppState["ui"] = initialUIState, action: IActionMap) => {
    return produce(stateRaw, (draft) => {
      switch (action.type) {
        case getType(actions.setTitle):
          draft.title = action.payload.title;
          break;
        case getType(actions.setModal):
          const { modal } = draft.modalManager;
          if (modal !== null && action.payload.modalType !== modal.type) {
            console.error(
              `"${modal.type}" already visible while trying to show "${action.payload.modalType}"`
            );
          } else {
            draft.modalManager.modal = action.payload.status
              ? { type: action.payload.modalType }
              : null;
          }
          break;
        case getType(actions.showConfirmation):
          draft.modalManager.confirmations.push({
            type: action.payload.confirmationType,
            params: action.payload.params
          });
          break;
        case getType(actions.clearConfirmation):
          draft.modalManager.confirmations = draft.modalManager.confirmations.filter(
            (conf) => conf.type !== action.payload.confirmationType
          );
          break;
        // File Management
        case getType(actions.popupFileInput):
          draft.uploadManager.shouldOpenFI = action.payload.status;
          break;
        case getType(actions.selectFile):
          if (action.payload === null) {
            draft.uploadManager.upload = null;
          } else {
            draft.uploadManager.upload = {
              file: action.payload,
              status: NetworkStatus.UNSENT,
              name: "",
              errors: []
            };
          }
          break;
        case getType(networkActions.submitUploadRequest):
          if (draft.uploadManager.upload === null) {
            console.warn("Trying to submit null upload");
          } else {
            draft.uploadManager.upload.status = NetworkStatus.REQUEST;
          }
          break;
        case getType(networkActions.submitUploadSuccess):
          if (draft.uploadManager.upload === null) {
            console.warn("Trying to submit null upload (success)");
          } else {
            draft.uploadManager.upload.status = NetworkStatus.SUCCESS;
          }
          break;
        case getType(networkActions.submitUploadFailure):
          if (draft.uploadManager.upload === null) {
            console.warn("Trying to submit null upload (failure)");
          } else {
            draft.uploadManager.upload.status = NetworkStatus.FAILURE;
            draft.uploadManager.upload.errors = action.payload.errors;
          }
          break;
        case getType(actions.skipFile):
          if (draft.uploadManager.upload === null) {
            console.warn("Trying to skip null upload");
          } else {
            draft.uploadManager.upload.ignored = true;
          }
          break;
        case getType(actions.modifyUpload):
          if (draft.uploadManager.upload === null) {
            console.warn("Trying to modify null upload");
          } else {
            draft.uploadManager.upload.status = NetworkStatus.UNSENT;
            draft.uploadManager.upload = {
              ...draft.uploadManager.upload,
              ...action.payload.modifications
            };
            // draft.uploadManager.uploads[action.payload.i].errors = [];
          }
          break;
      }
    });
  },
  data: (stateRaw: IAppState["data"] = initialDataState, action: IActionMap) => {
    return produce(stateRaw, (draft) => {
      switch (action.type) {
        // ------------------------------------ Fetch Datasets ---------------------------------------
        case getType(networkActions.fetchDatasetsRequest):
          draft.network.datasets = NetworkStatus.REQUEST;
          break;
        case getType(networkActions.fetchDatasetsSuccess):
          draft.network.datasets = NetworkStatus.SUCCESS;
          draft.datasets = action.payload.reduce(
            (mapped: IAppState["data"]["datasets"], item: IDataset) => {
              mapped[item._id] = item;

              return mapped;
            },
            {}
          );
          break;
        case getType(networkActions.fetchDatasetsFailure):
          draft.network.datasets = NetworkStatus.FAILURE;
          console.error("Fetching datasets failed");
          break;
        // ------------------------------------ Fetch Alphabet ---------------------------------------
        case getType(networkActions.fetchAlphabetRequest):
          draft.network.alphabet = NetworkStatus.REQUEST;
          break;
        case getType(networkActions.fetchAlphabetSuccess):
          draft.network.alphabet = NetworkStatus.SUCCESS;
          draft.alphabet = action.payload;
          break;
        case getType(networkActions.fetchAlphabetFailure):
          draft.network.alphabet = NetworkStatus.FAILURE;
          console.error("Fetching alphabet failed");
          break;
      }
    });
  }
  // datasets: (stateRaw: IDatasetsState = initialNetworkState, action: IActionMap) => {
  //       // case ActionTypes.SUBMIT_UPLOAD:
  //       //   switch (a.status) {
  //       //     case NetworkStatus.SUCCESS:
  //       //       return {
  //       //         ...state,
  //       //         data: {
  //       //           ...state.data,
  //       //           [a.response.dataset.id]: a.response.dataset
  //       //         }
  //       //       };
  //       //     default:
  //       //       return state;
  //       //   }
  //     }
  //   });
  // },
  // alphabet: (stateRaw: IAlphabetState = initialNetworkState, action: IActionMap) => {
  //       // case ActionTypes.FETCH_ALPHABET:
  //       //   return networkReducer(state, action, {
  //       //     initialState: initialNetworkState,
  //       //     clearData: true,
  //       //     transformResponse: (response: any) => response
  //       //   });
  //     }
  //   });
  // }
  // upload: (state: IUploadState = initialUploadState, action: IActionMap) => {
  //   switch (action.type) {
  //     case getType(basicActions.popupFileInput):
  //       return {
  //         ...state,
  //         uploadManager: action.payload
  //       };
  //     case getType(basicActions.selectFile):
  //       if (state.files.length > 0 && action.payload.length > 0) {
  //         console.warn("Setting files while files already exist. Old state will be cleared");
  //       }
  //
  //       return {
  //         ...state,
  //         files: action.payload
  //       };
  //     case getType(basicActions.skipFile):
  //       return {
  //         ...state,
  //         files: [
  //           ...state.files.slice(0, action.payload.i),
  //           null,
  //           ...state.files.slice(action.payload.i + 1)
  //         ]
  //       };
  //     // case ActionTypes.SUBMIT_UPLOAD:
  //     //   // TODO: HERE
  //     //   const a = action as AnyAction;
  //     //   switch (a.status) {
  //     //     case NetworkStatus.SUCCESS:
  //     //       if (a.i === state.files.length - 1) {
  //     //         return {
  //     //           ...state,
  //     //           files: []
  //     //         };
  //     //       }
  //     //       return {
  //     //         ...state,
  //     //         files: [...state.files.slice(0, a.i), null, ...state.files.slice(a.i + 1)]
  //     //       };
  //     //     default:
  //     //       return state;
  //     //   }
  //     default:
  //       return state;
  //   }
  // }
});
/* tslint:enable:switch-default */
