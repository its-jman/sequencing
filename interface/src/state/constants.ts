import React from "react";

import { ResumeUpload } from "src/components/modalManager/confirmations/resumeUpload";
import { UploadModal } from "src/components/modalManager/modals/uploadModal";

export enum ModalType {
  UPLOAD_MANAGER = "UPLOAD_MANAGER"
}

export enum ConfirmationType {
  RESUME_UPLOAD = "RESUME_UPLOAD"
}

export const ModalMap: { [K in ModalType]: React.FC } = {
  UPLOAD_MANAGER: UploadModal
};

export const ConfirmationMap: { [K in ConfirmationType]: React.FC } = {
  RESUME_UPLOAD: ResumeUpload
};
