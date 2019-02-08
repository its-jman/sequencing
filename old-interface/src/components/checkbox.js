import React from "react";

class Checkbox extends React.Component {
  state = {
    checked: false
  };

  _onChange = (event) => {
    this.setState({ checked: event.target.checked });
  };

  render() {
    return (
      <div className="pretty p-icon">
        <input
          type="checkbox"
          id={this.props.id}
          checked={this.state.checked}
          onChange={this._onChange}
        />
        <div className="state">
          <i className="icon mdi mdi-check" />
          <label htmlFor={this.props.id}>{this.props.label}</label>
        </div>
      </div>
    );
  }
}

export default Checkbox;
