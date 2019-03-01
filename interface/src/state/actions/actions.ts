import { createStandardAction } from "typesafe-actions";

import { IConfirmationParams } from "src/state/models";
import { ConfirmationType, ModalType } from "src/state/constants";

type ISetTitle = { title: string | null };
type ISetModal = { modalType: ModalType; status: boolean };
type IShowConfirmation = { confirmationType: ConfirmationType; params: IConfirmationParams };
type IClearConfirmation = { confirmationType: ConfirmationType };
type ISelectFile = File | null;
type ISetFileInput = { status: boolean };
type ISkipFile = { i: number };
type IModifyFile = { i: number; modifications: { name?: string } };

export const basicActions = {
  setTitle: createStandardAction("SET_TITLE")<ISetTitle>(),
  setModal: createStandardAction("SET_MODAL")<ISetModal>(),
  showConfirmation: createStandardAction("SHOW_CONFIRMATION")<IShowConfirmation>(),
  clearConfirmation: createStandardAction("CLEAR_CONFIRMATION")<IClearConfirmation>(),

  selectFile: createStandardAction("SELECT_FILE")<ISelectFile>(),
  popupFileInput: createStandardAction("POPUP_FILE_INPUT")<ISetFileInput>(),
  skipFile: createStandardAction("SKIP_FILE")<ISkipFile>(),
  modifyUpload: createStandardAction("MODIFY_UPLOAD")<IModifyFile>()
};
