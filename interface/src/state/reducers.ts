import { AnyAction, combineReducers } from "redux";
import { actions } from "src/state/actions";
import { networkReducer } from "src/state/network/utils";
import { IDataset, IDatasetsState } from "src/state/models";

const initialContextState = {
  title: undefined
};

const initialDatasetsState = {
  isFetching: false,
  errors: {},
  data: {}
};

export default combineReducers({
  context: (state = initialContextState, action: AnyAction) => {
    switch (action.type) {
      case actions.SET_TITLE:
        return {
          ...state,
          title: action.payload
        };
      default:
        return state;
    }
  },
  datasets: (state = initialDatasetsState, action: AnyAction) => {
    switch (action.type) {
      case actions.LOAD_DATASETS:
        return networkReducer(state, action, {
          initialState: initialDatasetsState,
          clearData: true,
          // @ts-ignore
          transformResponse: (response) =>
            response.reduce((state: IDatasetsState = {}, item: IDataset) => {
              state[item._id] = item;
              return state;
            }, {})
        });
      default:
        return state;
    }
  }
});
