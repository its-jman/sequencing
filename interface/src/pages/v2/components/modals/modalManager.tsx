import React, { PureComponent } from "react";
import { connect } from "react-redux";

import UploadModal from "./uploadModal";

import Modal from "src/components/modal";
import { IAppState, IConfirmationParams, IModalManager } from "src/state/models";
import { ModalType, ConfirmationType } from "src/state/actions";
import ClearUpload from "src/pages/v2/components/modals/confirmations/clearUpload";

const ModalMap: { [T in ModalType]: React.ComponentType } = {
  UPLOAD_MANAGER: UploadModal
};

const ConfirmationMap: { [T in ConfirmationType]: React.ComponentType<IConfirmationParams> } = {
  CLEAR_UPLOAD: ClearUpload
};

type IModalManagerProps = { modalManager: IModalManager };
class ModalManager extends PureComponent<IModalManagerProps> {
  _getModal = () => {
    const { modal } = this.props.modalManager;
    if (modal !== null) {
      const Inner = ModalMap[modal.type];
      if (Inner) {
        return (
          <Modal>
            <Inner />
          </Modal>
        );
      } else {
        console.error(`Invalid modal type: "${modal.type}"`);
      }
    }
    return null;
  };

  _getConfirmations = () => {
    const { confirmations } = this.props.modalManager;

    if (confirmations.length > 0) {
      const confirmation = confirmations[0];
      const Inner = ConfirmationMap[confirmation.type];
      if (Inner) {
        return (
          <Modal>
            <Inner {...confirmation.params} />
          </Modal>
        );
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
  modalManager: state.ui.modalManager
}))(ModalManager);
