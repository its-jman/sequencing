import React, { PureComponent } from "react";
import { FiEdit, FiX } from "react-icons/fi";
import { connect } from "react-redux";

import styles from "./_UploadModal.module.scss";

import { IAppState, IDispatchProps } from "src/state/models";
import { actions } from "src/state/actions";
import { ModalType } from "src/state/actions";
import { getClassNames } from "src/components/utils";

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
    const { files, dispatch } = this.props;
    const file = this._getFile(files);
    if (file.i === -1 || !file.file) {
      console.warn("File doesn't exist in upload manager.");
      dispatch(actions.setModal({ modalType: ModalType.UPLOAD_MANAGER, status: false }));
    }
    // @ts-ignore
    document.addEventListener("keydown", this._keyCapture, false);
  }
  componentWillUpdate(nextProps: Readonly<IUploadModalProps & IDispatchProps>): void {
    const { dispatch } = this.props;
    const file = this._getFile(nextProps.files);
    if (file.i === -1 || !file.file) {
      console.warn("File doesn't exist in upload manager.");
      dispatch(actions.setModal({ modalType: ModalType.UPLOAD_MANAGER, status: false }));
    }
  }

  componentWillUnmount() {
    // @ts-ignore
    document.removeEventListener("keydown", this._keyCapture, false);
  }

  _getFile = (files: Array<File | null>): IFile => {
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

  _skipOne = (i: number) => () => {
    const { dispatch, files } = this.props;
    if (i === files.length - 1) {
      this._cancel();
    } else {
      dispatch(actions.cancelFile({ i }));
    }
  };
  _cancel = () => {
    const { dispatch } = this.props;
    // dispatch(actions.selectFiles({ files: [] }));
    dispatch(actions.setModal({ modalType: ModalType.UPLOAD_MANAGER, status: false }));
  };
  _submit = (i: number) => () => {
    const { files, dispatch } = this.props;

    if (this.fields.nameInput!.value === "") {
      console.error("Name input null while submitting");
    } else {
      const name = this.fields.nameInput!.value;
      const file = files[i];
      if (file === null) {
        console.error("Can not upload null dataset...");
      } else {
        dispatch(actions.submitUpload({ file, name }));
      }
    }
  };

  render() {
    const { files } = this.props;
    const multi = files.length > 1;
    const file = this._getFile(files);
    if (file.i === -1 || !file.file) {
      return null;
    }

    return (
      <div className={styles.superContainer}>
        <div className={styles.container}>
          <MultiSelectionHeader files={files} file={file} />

          <div className={styles.header}>
            <div className={styles.headerTop}>
              <div className={styles.fileName}>{file.file.name}</div>

              <div className={styles.headerRight}>
                <button className={styles.formReset} onClick={this._resetForm}>
                  Reset Form
                </button>
                <FiX className={styles.closeIcon} onClick={this._closeModal} />
              </div>
            </div>

            <div className={styles.nameInputContainer}>
              <FiEdit
                className={styles.nameInputIcon}
                onClick={() => {
                  if (this.fields.nameInput !== null) {
                    this.fields.nameInput.focus();
                    this.fields.nameInput.select();
                  }
                }}
              />
              <input
                className={styles.nameInput}
                type="text"
                placeholder="Dataset name... "
                ref={(inp) => (this.fields.nameInput = inp)}
              />
            </div>
          </div>

          <div className={styles.content}>
            <div>{"Future ideas go here..."}</div>
          </div>
          <div className={styles.footerContainer}>
            <div className={styles.footer}>
              {multi && (
                <button
                  onClick={this._skipOne(file.i)}
                  className={getClassNames(styles.button, styles.secondaryButton)}
                >
                  Skip One
                </button>
              )}
              <button
                onClick={this._cancel}
                className={getClassNames(
                  styles.button,
                  multi ? styles.cancelButton : styles.secondaryButton
                )}
              >
                {`Cancel${multi ? " all" : ""}`}
              </button>
              <button
                onClick={this._submit(file.i)}
                className={getClassNames(styles.button, styles.submitButton)}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect<IUploadModalProps, IDispatchProps, {}, IAppState>(
  (state: IAppState) => ({
    files: state.ui.fileInput.files
  }),
  (dispatch) => ({
    dispatch: dispatch
  })
)(UploadModal);
