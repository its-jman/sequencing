import { AnyAction, combineReducers } from "redux";
import { ActionTypes, ModalType } from "src/state/actions";
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

const initialUIState: IUIState = {
  title: null,
  modalManager: {
    modal: null,
    confirmations: []
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
  ui: (state: IUIState = initialUIState, action: AnyAction) => {
    switch (action.type) {
      case ActionTypes.SET_TITLE:
        return {
          ...state,
          title: action.payload
        };
      case ActionTypes.SET_MODAL:
        const { modal } = state.modalManager;
        if (modal !== null && action.modalType !== modal.type) {
          console.error(
            `"${modal.type}" already visible while trying to show "${action.modalType}"`
          );
          return state;
        } else {
          return {
            ...state,
            modalManager: {
              ...state.modalManager,
              modal: action.status ? { type: action.modalType } : null
            }
          };
        }
      case ActionTypes.SHOW_CONFIRMATION:
        return {
          ...state,
          modalManager: {
            ...state.modalManager,
            confirmations: [
              ...state.modalManager.confirmations,
              { type: action.confirmationType, params: action.params }
            ]
          }
        };
      case ActionTypes.CLEAR_CONFIRMATION:
        const rest = state.modalManager.confirmations.filter(
          (conf) => conf.type !== action.confirmationType
        );

        return {
          ...state,
          modalManager: {
            ...state.modalManager,
            confirmations: rest
          }
        };
      default:
        return state;
    }
  },
  datasets: (state: IDatasetsState = initialNetworkState, action: AnyAction) => {
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
        switch (action.status) {
          case NetworkStatus.SUCCESS:
            return {
              ...state,
              data: {
                ...state.data,
                [action.response.dataset._id]: action.response.dataset
              }
            };
          default:
            return state;
        }
      default:
        return state;
    }
  },
  alphabet: (state: IAlphabetState = initialNetworkState, action: AnyAction) => {
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
  upload: (state: IUploadState = initialUploadState, action: AnyAction) => {
    switch (action.type) {
      case ActionTypes.SET_FILE_INPUT:
        return {
          ...state,
          fileInput: action.fileInput
        };
      case ActionTypes.SELECT_FILES:
        if (state.files.length > 0 && action.files.length > 0) {
          console.warn("Setting files while files already exist. Old state will be cleared");
        }
        // TODO: Gross. 0% redux-like programming, but... how should it be?
        if (action.files.length === 0 && state.fileInput !== null) {
          state.fileInput.value = "";
          state.fileInput.files = null;
        }
        return {
          ...state,
          files: action.files
        };
      case ActionTypes.CANCEL_FILE:
        return {
          ...state,
          files: [...state.files.slice(0, action.i), null, ...state.files.slice(action.i + 1)]
        };
      case ActionTypes.SUBMIT_UPLOAD:
        switch (action.status) {
          case NetworkStatus.SUCCESS:
            if (action.i === state.files.length - 1) {
              return {
                ...state,
                files: []
              };
            }
            return {
              ...state,
              files: [...state.files.slice(0, action.i), null, ...state.files.slice(action.i + 1)]
            };
          default:
            return state;
        }
      default:
        return state;
    }
  }
});
