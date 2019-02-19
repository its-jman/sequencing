import { AnyAction, combineReducers } from "redux";
import { actionIDs } from "src/state/actions";
import { networkReducer } from "src/state/network/utils";
import { IAppState, IDataset, IDatasetsStateData } from "src/state/models";

const initialContextState = {
  title: undefined
};

const initialUploadState = {
  files: [],
  currentUpload: 0
};

const initialNetworkState = {
  isFetching: false,
  errors: {},
  data: {}
};

export default combineReducers<IAppState>({
  context: (state = initialContextState, action: AnyAction) => {
    switch (action.type) {
      case actionIDs.SET_TITLE:
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
      case actionIDs.LOAD_DATASETS:
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
      case actionIDs.FETCH_ALPHABET:
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
      case actionIDs.SET_MODAL:
        return {
          ...state,
          [action.modalID]: action.status
        };
      default:
        return state;
    }
  }
});
