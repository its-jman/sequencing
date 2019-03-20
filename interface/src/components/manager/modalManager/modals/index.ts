import React from "react";

import { ModalType } from "src/state/constants";

import { UploadModal } from "./uploadModal";

export const ModalMap: { [K in ModalType]: React.FC } = {
  UPLOAD_MANAGER: UploadModal
};
