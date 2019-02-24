import { ActionType, createStandardAction } from "typesafe-actions";

import { IConfirmationParams } from "src/state/models";
import { asyncActions } from "./asyncActions";

export enum ModalType {
  UPLOAD_MANAGER = "UPLOAD_MANAGER"
}

export enum ConfirmationType {
  RESUME_UPLOAD = "CLEAR_UPLOAD"
}

type ISetModal = { modalType: ModalType; status: boolean };
type IShowConfirmation = { confirmationType: ConfirmationType; params: IConfirmationParams };
type IClearConfirmation = { confirmationType: ConfirmationType };

export const actions = {
  setTitle: createStandardAction("SET_TITLE")<{ title: string | null }>(),
  setModal: createStandardAction("SET_MODAL")<ISetModal>(),
  showConfirmation: createStandardAction("SHOW_CONFIRMATION")<IShowConfirmation>(),
  clearConfirmation: createStandardAction("CLEAR_CONFIRMATION")<IClearConfirmation>(),

  selectFiles: createStandardAction("SELECT_FILES")<Array<File>>(),
  setFileInput: createStandardAction("SET_FILE_INPUT")<{ status: boolean }>(),
  cancelFile: createStandardAction("CANCEL_FILE")<{ i: number }>(),

  ...asyncActions
};

export type IActionMap = ActionType<typeof actions>;
