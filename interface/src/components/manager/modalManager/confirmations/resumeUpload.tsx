import React, { useContext } from "react";

import styles from "./_ClearUpload.module.scss";
import { UIContext } from "src/state/stores/ui";
import Modal from "src/components/modal";
import { observer } from "mobx-react-lite";
import { ModalType } from "src/state/constants";

export const ResumeUpload = observer(() => {
  const uiStore = useContext(UIContext);

  return (
    <Modal>
      <div className={styles.container}>
        <div className={styles.body}>
          {"You already have uploads in progress, would you like to resume the upload?"}
        </div>
        <div className={styles.footer}>
          <button
            onClick={() => {
              uiStore.setUploads(null);
              uiStore.popupFileInput(true);
              uiStore.hideConfirmation();
            }}
            className={styles.clearButton}
          >
            Clear uploads
          </button>
          <button
            onClick={() => {
              uiStore.hideConfirmation();
              uiStore.showModal(ModalType.UPLOAD_MANAGER);
            }}
            className={styles.resumeButton}
          >
            Resume
          </button>
        </div>
      </div>
    </Modal>
  );
});
