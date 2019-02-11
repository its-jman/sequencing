import { Dispatch, Middleware } from "redux";
import { IAppState } from "src/state/index";

export const NETWORK_STATUS = {
  REQUEST: "REQUEST",
  SUCCESS: "SUCCESS",
  FAILURE: "FAILURE"
};
