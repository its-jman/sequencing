import { IAppState, IUIState, NetworkStatus } from "src/state/models";
import { actions, IActionMap } from "src/state/actions";
import produce from "immer";
import { combineReducers } from "redux";
import { getType } from "typesafe-actions";
import { networkActions } from "src/state/actions/network";

const is: IAppState["ui"] = {
  title: null,
  queryId: null,
  modalManager: {
    modal: null,
    confirmations: []
  },
  uploadManager: {
    shouldOpenFI: false,
    upload: null
  }
};

/* tslint:disable:switch-default */
export default combineReducers<IUIState>({
  title: (stateRaw: IUIState["title"] = is.title, action: IActionMap) => {
    return produce(stateRaw, (draft) => {
      switch (action.type) {
        case getType(actions.setTitle):
          draft = action.payload.title;
          break;
      }
    });
  },
  queryId: (stateRaw: IUIState["queryId"] = is.queryId, action: IActionMap) => {
    return produce(stateRaw, (draft) => {});
  },
  uploadManager: (stateRaw: IUIState["uploadManager"] = is.uploadManager, action: IActionMap) => {
    return produce(stateRaw, (draft) => {
      switch (action.type) {
        case getType(actions.popupFileInput):
          draft.shouldOpenFI = action.payload.status;
          break;
        case getType(actions.selectFile):
          if (action.payload === null) {
            draft.upload = null;
          } else {
            draft.upload = {
              file: action.payload,
              networkStatus: NetworkStatus.UNSENT,
              name: "",
              errors: []
            };
          }
          break;
        case getType(networkActions.submitUploadRequest):
          if (draft.upload === null) {
            console.warn("Trying to submit null upload");
          } else {
            draft.upload.networkStatus = NetworkStatus.REQUEST;
          }
          break;
        case getType(networkActions.submitUploadSuccess):
          if (draft.upload === null) {
            console.warn("Trying to submit null upload (success)");
          } else {
            draft.upload.networkStatus = NetworkStatus.SUCCESS;
          }
          break;
        case getType(networkActions.submitUploadFailure):
          if (draft.upload === null) {
            console.warn("Trying to submit null upload (failure)");
          } else {
            draft.upload.networkStatus = NetworkStatus.FAILURE;
            draft.upload.errors = action.payload.errors;
          }
          break;
        case getType(actions.skipFile):
          if (draft.upload === null) {
            console.warn("Trying to skip null upload");
          } else {
            draft.upload.ignored = true;
          }
          break;
        case getType(actions.modifyUpload):
          if (draft.upload === null) {
            console.warn("Trying to modify null upload");
          } else {
            draft.upload.networkStatus = NetworkStatus.UNSENT;
            draft.upload = {
              ...draft.upload,
              ...action.payload.modifications
            };
            // draft.uploadManager.upload.errors = [];
          }
          break;
      }
    });
  },
  modalManager: (stateRaw: IUIState["modalManager"] = is.modalManager, action: IActionMap) => {
    return produce(stateRaw, (draft) => {
      switch (action.type) {
        case getType(actions.setModal):
          if (draft.modal !== null && action.payload.modalType !== draft.modal.type) {
            console.error(
              `"${draft.modal.type}" already visible while trying to show "${
                action.payload.modalType
              }"`
            );
          } else {
            draft.modal = action.payload.status ? { type: action.payload.modalType } : null;
          }
          break;
        case getType(actions.showConfirmation):
          draft.confirmations.push({
            type: action.payload.confirmationType,
            params: action.payload.params
          });
          break;
        case getType(actions.clearConfirmation):
          draft.confirmations = draft.confirmations.filter(
            (conf) => conf.type !== action.payload.confirmationType
          );
          break;
      }
    });
  }
});
/* tslint:enable:switch-default */
