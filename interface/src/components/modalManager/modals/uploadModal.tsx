import React, { ChangeEvent, useRef, useState } from "react";
import { FiEdit, FiX } from "react-icons/fi";
import { connect } from "react-redux";

import styles from "./_UploadModal.module.scss";

import { IAppState, IDispatchProps, IUpload, NetworkStatus } from "src/state/models";
import { ModalType } from "src/state/constants";
import { getClassNames } from "src/components/utils";
import { actions } from "src/state/actions";
import { useKeydownHandler } from "src/utils";

type IDispatch = IDispatchProps["dispatch"];

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

const UploadModal2 = (props: { upload: IUpload | null } & IDispatchProps) => {
  const { upload, dispatch } = props;
  if (upload === null) {
    console.warn("Attempted to process a null upload, closing upload manager");
    dispatch(actions.setModal({ modalType: ModalType.UPLOAD_MANAGER, status: false }));
    return null;
  }

  const [ci, setCi] = useState(0);
  const fields = {
    name: useRef<HTMLInputElement>(null)
  };

  const hideModal = () => {
    // if (is NOT modified, or confirm you want to close...)
    if (upload.name === "" || window.confirm("Changes you made may not be saved.")) {
      dispatch(actions.setModal({ modalType: ModalType.UPLOAD_MANAGER, status: false }));
    }
  };

  useKeydownHandler({
    27: hideModal
  });

  return (
    <div className={styles.positioningContainer}>
      <div className={styles.container}>
        <MultiSelectionHeader ci={ci} total={1} />

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.fileName}>{upload.file.name}</div>
            <div className={styles.headerRight}>
              <button
                className={styles.formReset}
                onClick={() => {
                  dispatch(actions.modifyUpload({ i: ci, modifications: { name: "" } }));
                }}
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
                fields.name.current!.focus();
                fields.name.current!.select();
              }}
            />
            <input
              className={styles.nameInput}
              type="text"
              placeholder="Dataset name... "
              value={upload.name}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                dispatch(
                  actions.modifyUpload({ i: ci, modifications: { name: event.target.value } })
                );
              }}
              ref={fields.name}
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
          skipOne={ci >= 1 ? () => dispatch(actions.skipFile({ i: ci })) : undefined}
          hideModal={hideModal}
          submit={() => {
            dispatch(actions.submitUpload(ci));
          }}
        />
      </div>
    </div>
  );
};

// type IModalProps = {
//   upload: IUpload;
// } & IDispatchProps;
//
// class UploadModal extends PureComponent<IModalProps, IModalState> {
//   nameInput = React.createRef<HTMLInputElement>();
//
//   componentWillMount() {
//     const { upload, dispatch } = this.props;
//
//     // @ts-ignore
//     document.addEventListener("keydown", this._keyCapture, false);
//   }
//   componentWillUpdate(nextProps: Readonly<IUIState["uploadManager"] & IDispatchProps>): void {
//     const { dispatch } = this.props;
//     const ci = UploadModal._getCi(nextProps.uploads);
//     if (i === -1 || !file.file) {
//       console.warn("File doesn't exist in upload manager.");
//       dispatch(actions.setModal({ modalType: ModalType.UPLOAD_MANAGER, status: false }));
//     }
//   }
//
//   componentWillUnmount() {
//     // @ts-ignore
//     document.removeEventListener("keydown", this._keyCapture, false);
//   }
//
//   static _getCi = (uploads: IUploads) => {
//     let fileIndex = -1;
//     for (let i = 0; i < uploads.length; i++) {
//       if (uploads[i] !== null) {
//         return fileIndex;
//       }
//     }
//
//     return -1;
//   };
//
//   render() {
//     const { uploads } = this.props;
//
//     return (
//       <div className={styles.positioningContainer}>
//         <div className={styles.container}>
//           <MultiSelectionHeader ci={ci} total={uploads.length} />
//
//           {/* Header */}
//           <div className={styles.header}>
//             <div className={styles.headerTop}>
//               <div className={styles.fileName}>{file.file.name}</div>
//               <div className={styles.headerRight}>
//                 <button
//                   className={styles.formReset}
//                   onClick={() => {
//                     dispatch(actions.modifyUpload({ i: ci, modifications: { name: "" } }));
//                   }}
//                 >
//                   {"Reset Form"}
//                 </button>
//                 <FiX className={styles.closeIcon} onClick={hideModal} />
//               </div>
//             </div>
//             <div className={styles.nameInputContainer}>
//               <FiEdit
//                 className={styles.nameInputIcon}
//                 onClick={() => {
//                   this.nameInput.current!.focus();
//                   this.nameInput.current!.select();
//                 }}
//               />
//               <input
//                 className={styles.nameInput}
//                 type="text"
//                 placeholder="Dataset name... "
//                 value={file.name}
//                 onChange={(event: ChangeEvent<HTMLInputElement>) => {
//                   dispatch(
//                     actions.modifyUpload({ i: ci, modifications: { name: event.target.value } })
//                   );
//                 }}
//                 ref={this.nameInput}
//               />
//             </div>
//           </div>
//
//           {/* Content */}
//           <div className={styles.content}>
//             <div>{"Future ideas go here..."}</div>
//             {file.errors.length > 0 && (
//               <ul style={{ marginLeft: 20 }}>
//                 {file.errors.map((err, i) => (
//                   <li key={i}>{err}</li>
//                 ))}
//               </ul>
//             )}
//           </div>
//
//           {/* Footer */}
//           <ModalFooter
//             skipOne={uploads.length > 1 ? () => dispatch(actions.skipFile({ i: ci })) : undefined}
//             hideModal={this._hideModal}
//             submit={() => {
//               dispatch(actions.submitUpload(ci));
//             }}
//           />
//         </div>
//       </div>
//     );
//   }
// }

export default connect<{ upload: IUpload | null }, IDispatchProps, {}, IAppState>(
  (state: IAppState) => ({
    upload: state.ui.uploadManager.upload
  }),
  (dispatch) => ({ dispatch })
)(UploadModal2);
