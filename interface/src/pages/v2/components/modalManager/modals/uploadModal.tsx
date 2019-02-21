import React, { PureComponent } from "react";
import { FiEdit, FiX } from "react-icons/fi";
import { connect } from "react-redux";

import styles from "./_UploadModal.module.scss";

import { IAppState, IDispatchProps } from "src/state/models";
import * as actions from "src/state/actions";
import { ModalType } from "src/state/actions";

type IUploadModalProps = {
  files: Array<File | null>;
};

type IFile = {
  i: number;
  file: File | null;
};

class MultiSelectionHeader extends PureComponent<IUploadModalProps & { file: IFile }> {
  render() {
    const { files, file } = this.props;
    if (!(files.length > 1)) return null;
    return (
      <div className={styles.multiSelectionHeader}>
        <span>{"Uploading: "}</span>
        <span>{file.i + 1}</span>
        <span>{`/${files.length}`}</span>
      </div>
    );
  }
}

class UploadModal extends PureComponent<IUploadModalProps & IDispatchProps> {
  fields: {
    nameInput: HTMLInputElement | null;
  } = {
    nameInput: null
  };

  _keyCapture = (event: React.KeyboardEvent<HTMLDivElement>) => {
    // catch escape
    if (event.keyCode === 27) {
      event.stopPropagation();
      this._closeModal();
    }
  };
  componentWillMount() {
    // @ts-ignore
    document.addEventListener("keydown", this._keyCapture, false);
  }
  componentWillUnmount() {
    // @ts-ignore
    document.removeEventListener("keydown", this._keyCapture, false);
  }

  _getFile = (): IFile => {
    const { files, dispatch } = this.props;

    let fileIndex = -1;
    for (let i = 0; i < files.length; i++) {
      if (files[i] !== null) {
        fileIndex = i;
        break;
      }
    }

    return {
      i: fileIndex,
      file: files[fileIndex]
    };
  };

  _resetForm = () => {
    for (const field of Object.values(this.fields)) {
      if (field !== null) {
        field.value = "";
      }
    }
  };

  _areFieldsModified = (): boolean => {
    for (const field of Object.values(this.fields)) {
      if (field !== null) {
        if (field.value !== "") return true;
      }
    }
    return false;
  };

  _closeModal = () => {
    const { dispatch } = this.props;

    if (!this._areFieldsModified() || window.confirm("Changes you made may not be saved.")) {
      dispatch(actions.setModal({ modalType: ModalType.UPLOAD_MANAGER, status: false }));
    }
  };

  _submitForm = () => {};

  render() {
    const { files, dispatch } = this.props;

    const file = this._getFile();
    if (file.i === -1 || !file.file) {
      console.error("File doesn't exist in upload manager.");
      dispatch(actions.setModal({ modalType: ModalType.UPLOAD_MANAGER, status: false }));
      return null;
    }

    return (
      <div className={styles.superContainer}>
        <div className={styles.container}>
          <MultiSelectionHeader files={files} file={file} />
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <div className={styles.nameInputContainer}>
                <input
                  className={styles.nameInput}
                  type="text"
                  placeholder="Dataset name... "
                  ref={(inp) => (this.fields.nameInput = inp)}
                />
                <FiEdit
                  className={styles.nameInputIcon}
                  onClick={() => {
                    if (this.fields.nameInput !== null) {
                      this.fields.nameInput.focus();
                      this.fields.nameInput.select();
                    }
                  }}
                />
              </div>
              <div className={styles.fileName}>{file.file.name}</div>
            </div>

            <div className={styles.headerRight}>
              <button className={styles.formReset} onClick={this._resetForm}>
                Reset Form
              </button>
              <FiX className={styles.closeIcon} onClick={this._closeModal} />
            </div>
          </div>

          <div className={styles.content}>
            <div className={styles.contentBody}>
              <div>{"Future ideas go here..."}</div>
            </div>

            <hr />
            <button className={styles.submitButton}>Submit</button>
          </div>
        </div>
      </div>
    );
  }
}

export default connect<IUploadModalProps, IDispatchProps, {}, IAppState>(
  (state: IAppState) => ({
    files: state.upload.files
  }),
  (dispatch) => ({
    dispatch: dispatch
  })
)(UploadModal);
