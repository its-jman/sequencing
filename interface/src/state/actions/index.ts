import { ActionType } from "typesafe-actions";

import { basicActions } from "./actions";
import { networkActions } from "./network";
import { thunks } from "./thunks";
import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
import { IAppState } from "src/state/models";

export const actions = {
  ...basicActions,
  ...thunks
};

export type IActionMap = ActionType<typeof basicActions | typeof networkActions>;
export type IThunkAction = ThunkAction<void, IAppState, {}, AnyAction>;
