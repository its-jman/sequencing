import React, { PureComponent } from "react";
import { connect } from "react-redux";

import styles from "./_ModalManager.module.scss";
import { IAppState, IModalManager, IUIState } from "src/state/models";
import Modal from "src/components/modal";
import UploadModal from "pages/v2/components/modals/uploadModal";
import { ModalType, ConfirmationType } from "src/state/actions";

const ModalMap: { [T in ModalType]: React.ReactNode } = {
  UPLOAD_MANAGER: UploadModal
};

const ConfirmationMap: { [T in ConfirmationType]: React.ReactNode } = {
  CLEAR_UPLOAD: UploadModal
};

type IModalManagerProps = { modal: IModalManager };
class ModalManager extends PureComponent<IModalManagerProps> {
  _getModal = () => {
    const { modal } = this.props.modal;
    if (modal !== null) {
      const inner = ModalMap[modal.type];
      if (inner) {
        return <Modal>{inner}</Modal>;
      } else {
        console.error(`Invalid modal type: "${modal.type}"`);
      }
    }
    return null;
  };

  _getConfirmations = () => {
    const { confirmations } = this.props.modal;

    if (confirmations.length > 0) {
      const confirmation = confirmations[0];
      const inner = ConfirmationMap[confirmation.type];
      if (inner) {
        return <Modal>{inner}</Modal>;
      } else {
        console.error(`Invalid confirmation type: "${confirmation.type}"`);
      }
    }
    return null;
  };

  render() {
    return (
      <>
        {this._getModal()}
        {this._getConfirmations()}
      </>
    );
  }
}

export default connect<IModalManagerProps, {}, {}, IAppState>((state) => ({
  modal: state.ui.modal
}))(ModalManager);
