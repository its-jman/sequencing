import React from "react";

type IModalProps = {
  visible: boolean;
  onBgClick: () => void;
  display: string;
};

class Modal extends React.Component<IModalProps> {
  static defaultProps = {
    display: "block",
    visible: false
  };

  _filterBgClick = (fn: () => void) => {
    return (event: React.MouseEvent) => {
      if (event.target === event.currentTarget) {
        fn();
      }
    };
  };

  render() {
    const { display, onBgClick, visible, children } = this.props;

    const shownStyle = { display: visible ? display : "none" };

    return (
      <>
        <div className="modal" onClick={this._filterBgClick(onBgClick)} style={shownStyle}>
          {children}
        </div>
      </>
    );
  }
}

export default Modal;
