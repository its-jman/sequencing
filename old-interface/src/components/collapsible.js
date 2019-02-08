import React from "react";
import PropTypes from "prop-types";

class Collapsible extends React.Component {
  static propTypes = {
    triggerElement: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
  };

  static defaultProps = {
    transitionTime: 400
  };

  state = {
    isClosed: true
  };

  render() {
    return (
      <div className="collapsible-container">
        <div className="collapsible">{this.props.triggerElement}</div>
        <div className="collapsible-content">{this.props.children}</div>
      </div>
    );
  }
}

export default Collapsible;
