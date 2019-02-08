import types from "../actions/types";

const initialState = {
  active: "",
  checked: []
};

export const selection = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_ACTIVE:
      return {
        active: action.datasetID,
        checked: []
      };
    case types.DELETE_DATASET:
      const index = state.checked.indexOf(action.payload.datasetID);
      return {
        active: state.active === action.payload.datasetID ? "" : state.active,
        checked: index > -1 ? [...state.checked.splice(index, 1)] : state.checked
      };
    default:
      return state;
  }
};
