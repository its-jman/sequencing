import types from "../actions/types";

const initialState = {
  active: "",
  checked: []
};

export const selection = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_ACTIVE:
      return {
        active: action["dataset_id"],
        checked: []
      };
    case types.DELETE_DATASET:
      const index = state.checked.indexOf(action.payload["dataset_id"]);
      return {
        active: state.active === action.payload["dataset_id"] ? "" : state.active,
        checked: index > -1 ? [...state.checked.splice(index, 1)] : state.checked
      };
    default:
      return state;
  }
};
