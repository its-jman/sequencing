import React from "react";

import styles from "./_modals.module.scss";

type IModalProps = {
  visible: boolean;
  onBgClick?: () => void;
  display?: string;
  children: React.ReactNode;
};

class Modal extends React.PureComponent<IModalProps> {
  static defaultProps = {
    visible: true,
    display: "block"
  };

  _onBgClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      const { onBgClick } = this.props;
      if (typeof onBgClick === "function") onBgClick();
    }
  };

  render() {
    const { display, visible, children } = this.props;

    const shownStyle = { display: visible ? display : "none" };
    return (
      <>
        <div className={styles.fullScreenModal} onClick={this._onBgClick} style={shownStyle}>
          <div className={styles.fullScreenContainer}>{children}</div>
        </div>
      </>
    );
  }
}

export default Modal;
