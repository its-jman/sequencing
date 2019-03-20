import React, { ChangeEvent, useContext, useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";

import { UIContext } from "src/state/stores/ui";
import { ModalType } from "src/state/constants";

export const ControlledFileInput = observer(() => {
  const uiStore = useContext(UIContext);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log("SHOULD OPEN");
    console.log(uiStore.shouldOpenFI);
    if (uiStore.shouldOpenFI) {
      fileInput.current!.click();
      uiStore.popupFileInput(false);
    }
  }, [uiStore.shouldOpenFI]);

  return (
    <input
      type="file"
      style={{ display: "none" }}
      /* Permenamtly resets value to "" to prevent null responses when the same file is selected twice */
      value={""}
      multiple={false}
      ref={fileInput}
      onChange={(event: ChangeEvent<HTMLInputElement>) => {
        if (!fileInput.current!.files) {
          console.warn("File Input files is null");
          return;
        }

        const file = fileInput.current!.files[0];
        // `File` is a custom object which is not enumerable through traditional Object means.
        if (file === null || file === undefined || file.name.length === 0) {
          console.warn('File is "empty"');
          console.warn(file);
        } else {
          uiStore.setUploads([file]);
          uiStore.showModal(ModalType.UPLOAD_MANAGER);
        }
      }}
    />
  );
});
