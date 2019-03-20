import React from "react";

import { ConfirmationType } from "src/state/constants";

import { ResumeUpload } from "./resumeUpload";

export const ConfirmationMap: { [K in ConfirmationType]: React.FC } = {
  RESUME_UPLOAD: ResumeUpload
};
