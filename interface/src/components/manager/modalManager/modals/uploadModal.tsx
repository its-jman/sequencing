import React, { ChangeEvent, useCallback, useContext, useRef, useState } from "react";
import { FiEdit, FiX } from "react-icons/fi";
import { observer } from "mobx-react-lite";

import { getClassNames } from "src/utils";
import { useKeydownHandler } from "src/utils";
import { UIContext } from "src/state/stores/ui";

import styles from "./_UploadModal.module.scss";
import { ModalType } from "src/state/constants";
import Modal from "src/components/modal";

/**
 * TODO: This should be changed to show a list of files that are being uploaded.
 *    List should be clickable (set ci), and cancelable.
 */
const MultiSelectionHeader = (props: { ci: number; total: number }) => {
  const { ci, total } = props;

  if (!(total > 1)) return null;
  return (
    <div className={styles.multiSelectionHeader}>
      <span>{"Uploading: "}</span>
      <span>{ci + 1}</span>
      <span>{`/${total}`}</span>
    </div>
  );
};

const ModalFooter = (props: {
  skipOne?: () => void;
  hideModal: () => void;
  submit: () => void;
}) => {
  const { skipOne, hideModal, submit } = props;
  const multi = !!skipOne;

  return (
    <div className={styles.footerContainer}>
      <div className={styles.footer}>
        {multi && (
          <button
            onClick={skipOne}
            className={getClassNames(styles.button, styles.secondaryButton)}
          >
            Skip One
          </button>
        )}
        <button
          onClick={hideModal}
          className={getClassNames(
            styles.button,
            multi ? styles.cancelButton : styles.secondaryButton
          )}
        >
          {`Cancel${multi ? " all" : ""}`}
        </button>
        <button onClick={submit} className={getClassNames(styles.button, styles.submitButton)}>
          Submit
        </button>
      </div>
    </div>
  );
};

export const UploadModal = observer(() => {
  const uiStore = useContext(UIContext);
  const [ci, setCi] = useState(0);
  const nameInput = useRef<HTMLInputElement>(null);

  if (uiStore.uploads === null) {
    console.warn("Trying to show uploads manager with no valid uploads. Hiding... ");
    uiStore.hideModal(ModalType.UPLOAD_MANAGER);
    return null;
  }

  const upload = uiStore.uploads[ci];
  const hideModal = useCallback(() => {
    // if (is NOT modified, or confirm you want to close...)
    if (upload.name === "" || window.confirm("Changes you made may not be saved.")) {
      uiStore.hideModal(ModalType.UPLOAD_MANAGER);
    }
  }, [upload]);

  useKeydownHandler({
    27: hideModal
  });

  return (
    <Modal>
      <div className={styles.positioningContainer}>
        <div className={styles.container}>
          <MultiSelectionHeader ci={ci} total={uiStore.uploads.length} />

          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerTop}>
              <div className={styles.fileName}>{upload.file.name}</div>
              <div className={styles.headerRight}>
                <button
                  className={styles.formReset}
                  onClick={() => uiStore.modifyUpload(ci, { name: "" })}
                >
                  {"Reset Form"}
                </button>
                <FiX className={styles.closeIcon} onClick={hideModal} />
              </div>
            </div>
            <div className={styles.nameInputContainer}>
              <FiEdit
                className={styles.nameInputIcon}
                onClick={() => {
                  nameInput.current!.focus();
                  nameInput.current!.select();
                }}
              />
              <input
                className={styles.nameInput}
                type="text"
                placeholder="Dataset name... "
                value={upload.name}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  uiStore.modifyUpload(ci, { name: event.target.value });
                }}
                ref={nameInput}
              />
            </div>
          </div>

          {/* Content */}
          <div className={styles.content}>
            <div>{"Future ideas go here..."}</div>
            {upload.errors.length > 0 && (
              <ul style={{ marginLeft: 20 }}>
                {upload.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          <ModalFooter
            skipOne={ci >= 1 ? () => uiStore.modifyUpload(ci, { ignored: true }) : undefined}
            hideModal={hideModal}
            submit={() => uiStore.submitUpload(ci)}
          />
        </div>
      </div>
    </Modal>
  );
});
