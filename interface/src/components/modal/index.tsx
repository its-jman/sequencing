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
    display: "block",
    visible: false
  };

  _filterBgClick = (fn: (() => void) | undefined) => {
    return (event: React.MouseEvent) => {
      if (event.target === event.currentTarget) {
        if (typeof fn === "function") fn();
      }
    };
  };

  render() {
    const { display, onBgClick, visible, children } = this.props;

    const shownStyle = { display: visible ? display : "none" };
    return (
      <>
        <div
          className={styles.fullScreenModal}
          onClick={this._filterBgClick(onBgClick)}
          style={shownStyle}
        >
          <div className={styles.fullScreenContainer}>{children}</div>
        </div>
      </>
    );
  }
}

export default Modal;
