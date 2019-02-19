import React, { PureComponent } from "react";

// import styles from "./_LoadingModal.module.scss";
import { FiCheck, FiX } from "react-icons/fi";

class LoadingModal extends PureComponent {
  render() {
    return (
      <div>
        <FiCheck size={20} />
        <FiX size={20} />
      </div>
    );
  }
}

export default LoadingModal;
