import React from "react";
import PropTypes from "prop-types";

class Modal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    onBgClick: PropTypes.func.isRequired,
    display: PropTypes.string
  };

  static defaultProps = {
    display: "block",
    visible: false
  };

  _filterBgClick = (fn) => {
    return (e) => {
      if (e.target === e.currentTarget) {
        fn();
      }
    };
  };

  render() {
    const { display, onBgClick, visible, children } = this.props;

    const shownStyle = { display: visible ? display : "none" };

    return (
      <React.Fragment>
        <div className="modal" onClick={this._filterBgClick(onBgClick)} style={shownStyle}>
          {children}
        </div>
      </React.Fragment>
    );
  }
}

export default Modal;
