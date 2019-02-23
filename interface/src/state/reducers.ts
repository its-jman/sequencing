import { AnyAction, combineReducers } from "redux";
import { actions, ActionTypes, IActionMap, ModalType } from "src/state/actions";
import { networkReducer } from "src/state/network/utils";
import {
  IAlphabetState,
  IAppState,
  IDataset,
  IDatasetsState,
  IDatasetsStateData,
  IUIState,
  IUploadState
} from "src/state/models";
import { NetworkStatus } from "src/state/network/types";
import { getType } from "typesafe-actions";

const initialUIState: IUIState = {
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

const initialUploadState: IUploadState = {
  fileInput: null,
  files: []
};

const initialNetworkState = {
  isFetching: false,
  errors: {},
  data: {}
};

export default combineReducers<IAppState>({
  ui: (state: IUIState = initialUIState, action: IActionMap | AnyAction) => {
    switch (action.type) {
      case getType(actions.setTitle):
        return {
          ...state,
          title: action.payload
        };
      case getType(actions.setModal):
        const { modal } = state.modalManager;
        if (modal !== null && action.payload.modalType !== modal.type) {
          console.error(
            `"${modal.type}" already visible while trying to show "${action.payload.modalType}"`
          );
          return state;
        } else {
          return {
            ...state,
            modalManager: {
              ...state.modalManager,
              modal: action.payload.status ? { type: action.payload.modalType } : null
            }
          };
        }
      case getType(actions.showConfirmation):
        return {
          ...state,
          modalManager: {
            ...state.modalManager,
            confirmations: [
              ...state.modalManager.confirmations,
              { type: action.payload.confirmationType, params: action.payload.params }
            ]
          }
        };
      case getType(actions.clearConfirmation):
        const rest = state.modalManager.confirmations.filter(
          (conf) => conf.type !== action.payload.confirmationType
        );

        return {
          ...state,
          modalManager: {
            ...state.modalManager,
            confirmations: rest
          }
        };
      case getType(actions.setFileInput):
        return {
          ...state,
          fileInput: {
            ...state.fileInput,
            shouldOpen: action.payload
          }
        };
      default:
        return state;
    }
  },
  datasets: (state: IDatasetsState = initialNetworkState, action: IActionMap | AnyAction) => {
    switch (action.type) {
      case ActionTypes.LOAD_DATASETS:
        return networkReducer(state, action, {
          initialState: initialNetworkState,
          clearData: true,
          transformResponse: (response: any) =>
            response.reduce((state: IDatasetsStateData, item: IDataset) => {
              state[item._id] = item;
              return state;
            }, {})
        });
      case ActionTypes.SUBMIT_UPLOAD:
        // TODO: HERE
        const a = action as AnyAction;
        switch (a.status) {
          case NetworkStatus.SUCCESS:
            return {
              ...state,
              data: {
                ...state.data,
                [a.response.dataset._id]: a.response.dataset
              }
            };
          default:
            return state;
        }
      default:
        return state;
    }
  },
  alphabet: (state: IAlphabetState = initialNetworkState, action: IActionMap | AnyAction) => {
    switch (action.type) {
      case ActionTypes.FETCH_ALPHABET:
        return networkReducer(state, action, {
          initialState: initialNetworkState,
          clearData: true,
          transformResponse: (response: any) => response
        });
      default:
        return state;
    }
  },
  upload: (state: IUploadState = initialUploadState, action: IActionMap | AnyAction) => {
    switch (action.type) {
      case getType(actions.setFileInput):
        return {
          ...state,
          fileInput: action.payload
        };
      case getType(actions.selectFiles):
        if (state.files.length > 0 && action.payload.length > 0) {
          console.warn("Setting files while files already exist. Old state will be cleared");
        }

        return {
          ...state,
          files: action.payload
        };
      case getType(actions.cancelFile):
        return {
          ...state,
          files: [
            ...state.files.slice(0, action.payload),
            null,
            ...state.files.slice(action.payload + 1)
          ]
        };
      case ActionTypes.SUBMIT_UPLOAD:
        // TODO: HERE
        const a = action as AnyAction;
        switch (a.status) {
          case NetworkStatus.SUCCESS:
            if (a.i === state.files.length - 1) {
              return {
                ...state,
                files: []
              };
            }
            return {
              ...state,
              files: [...state.files.slice(0, a.i), null, ...state.files.slice(a.i + 1)]
            };
          default:
            return state;
        }
      default:
        return state;
    }
  }
});
