import { AnyAction, combineReducers } from "redux";
import { ActionTypes } from "src/state/actions";
import { networkReducer } from "src/state/network/utils";
import { IAppState, IDataset, IDatasetsStateData, IUIState, IUploadState } from "src/state/models";

const initialUIState: IUIState = {
  title: null,
  modal: {
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
  ui: (state = initialUIState, action: AnyAction) => {
    switch (action.type) {
      case ActionTypes.SET_TITLE:
        return {
          ...state,
          title: action.payload
        };
      default:
        return state;
    }
  },
  datasets: (state = initialNetworkState, action: AnyAction) => {
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
  alphabet: (state = initialNetworkState, action: AnyAction) => {
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
  upload: (state = initialUploadState, action: AnyAction) => {
    switch (action.type) {
      default:
        return state;
    }
  }
});
