import React from "react";

import { ControlledFileInput } from "./controlledFileInput";
import { ModalManager } from "./modalManager";

export default React.memo(() => (
  <>
    <ControlledFileInput />
    <ModalManager />
  </>
));
