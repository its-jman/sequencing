import { combineReducers } from "redux";
import { getType } from "typesafe-actions";
import produce from "immer";

import { actions, IActionMap } from "src/state/actions";
import { IAppState, IDataset, IDatasetsState, NetworkStatus } from "src/state/models";

const initialUIState: IAppState["ui"] = {
  title: null,
  modalManager: {
    modal: null,
    confirmations: []
  },
  fileInput: {
    shouldOpen: false,
    files: []
  }
};

const initialDataState: IAppState["data"] = {
  network: {
    actions: []
  },
  datasets: {},
  alphabet: {}
};

const getNi = (draft: IAppState["data"], reqID: string) =>
  draft.network.actions.findIndex((act) => act.reqID === reqID);

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
            draft.modalManager.modal = action.payload.status ? { type: action.payload.modalType } : null;
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
        case getType(actions.selectFiles):
          draft.fileInput.files = action.payload;
          break;
        case getType(actions.setFileInput):
          draft.fileInput.shouldOpen = action.payload.status;
          break;
        case getType(actions.cancelFile):
          // TODO: Improve this to maintain file for re-reference
          draft.fileInput.files[action.payload.i] = null;
          break;
      }
    });
  },
  data: (stateRaw: IAppState["data"] = initialDataState, action: IActionMap) => {
    return produce(stateRaw, (draft) => {
      switch (action.type) {
        // Fetch Datasets ----------------
        case getType(actions.fetchDatasets.request):
          draft.network.actions.push({
            type: action.payload.reqType,
            reqID: action.payload.reqID,
            status: action.payload.status
          });
          break;
        case getType(actions.fetchDatasets.success):
          draft.network.actions[getNi(draft, action.payload.reqID)].status = action.payload.status;

          draft.datasets = action.payload.data.reduce((mapped: IDatasetsState, item: IDataset) => {
            mapped[item._id] = item;
            return mapped;
          }, {});
          break;
        case getType(actions.fetchDatasets.failure):
          console.error("Fetching datasets failed");
          draft.network.actions[getNi(draft, action.payload.reqID)].status = action.payload.status;
          break;

        // Fetch Alphabet -------------------
        case getType(actions.fetchAlphabet.request):
          break;
        case getType(actions.fetchAlphabet.success):
          draft.alphabet = action.payload;
          break;
        case getType(actions.fetchAlphabet.failure):
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
  //       //           [a.response.dataset._id]: a.response.dataset
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
  //     case getType(actions.setFileInput):
  //       return {
  //         ...state,
  //         fileInput: action.payload
  //       };
  //     case getType(actions.selectFiles):
  //       if (state.files.length > 0 && action.payload.length > 0) {
  //         console.warn("Setting files while files already exist. Old state will be cleared");
  //       }
  //
  //       return {
  //         ...state,
  //         files: action.payload
  //       };
  //     case getType(actions.cancelFile):
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
