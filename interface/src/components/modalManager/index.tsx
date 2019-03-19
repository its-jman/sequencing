import React, { useContext } from "react";
import { observer } from "mobx-react-lite";

import { ModalMap, ConfirmationMap } from "src/state/constants";
import { UIContext } from "src/state/stores/ui";
import { isEmpty } from "src/utils";

// type IModalManagerProps = { modalManager: IModalManager };
// class ModalManager extends PureComponent<IModalManagerProps> {
//   _getModal = () => {
//     const { modal } = this.props.modalManager;
//     if (modal !== null) {
//       const Inner = ModalMap[modal.type];
//       if (Inner) {
//         return (
//           <Modal>
//             <Inner />
//           </Modal>
//         );
//       } else {
//         console.error(`Invalid modal type: "${modal.type}"`);
//       }
//     }
//     return null;
//   };
//
//   _getConfirmations = () => {
//     const { confirmations } = this.props.modalManager;
//
//     if (confirmations.length > 0) {
//       const confirmation = confirmations[0];
//       const Inner = ConfirmationMap[confirmation.type];
//       if (Inner) {
//         return (
//           <Modal>
//             <Inner />
//           </Modal>
//         );
//       } else {
//         console.error(`Invalid confirmation type: "${confirmation.type}"`);
//       }
//     }
//     return null;
//   };
//
//   render() {
//     return (
//       <>
//         {this._getModal()}
//         {this._getConfirmations()}
//       </>
//     );
//   }
// }
//
// export default connect<IModalManagerProps, {}, {}, IAppState>((state) => ({
//   modalManager: state.ui.modalManager
// }))(ModalManager);

export const ModalManager = observer(() => {
  const uiStore = useContext(UIContext);

  let modal = null;
  if (uiStore.modal !== null) {
    modal = ModalMap[uiStore.modal.type];
    if (isEmpty(modal)) modal = null;
  }

  let confirmation = null;
  if (uiStore.modal !== null) {
    confirmation = ConfirmationMap[uiStore.confirmations[0].type];
    if (isEmpty(confirmation)) confirmation = null;
  }

  return (
    <>
      {modal !== null && modal({})}
      {confirmation !== null && confirmation({})}
    </>
  );
});
