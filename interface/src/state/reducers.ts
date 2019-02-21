import { AnyAction, combineReducers } from "redux";
import { ActionTypes } from "src/state/actions";
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

const initialUIState: IUIState = {
  title: null,
  modalManager: {
    modal: null,
    confirmations: []
  }
};

const initialUploadState: IUploadState = {
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
      case ActionTypes.SELECT_FILES:
        if (state.files.length > 0 && action.files.length > 0) {
          console.warn("Setting files while files already exist. Old state will be cleared");
        }
        return {
          ...state,
          files: action.files
        };
      default:
        return state;
    }
  }
});
