import React from "react";

class Input extends React.Component {
  // TODO: Move previous out of input
  state = {
    value: "",
    previousSubmission: ""
  };

  _onChange = (event) => {
    let val = event.target.value;
    if (this.props.autocapitalize) {
      val = val.toUpperCase();
    }

    this.setState({
      value: val
    });
  };

  _onKeyDown = (event) => {
    // Only call onSubmit handler when it has not already been called with active input.
    if (event.key === "Enter" && this.state.previousSubmission !== this.state.value) {
      const { onSubmit } = this.props;

      if (onSubmit) {
        onSubmit(this.state.value);
      }

      this.setState({
        previousSubmission: this.state.value
      });
    }
  };

  render() {
    const { className, autocapitalize, ...otherProps } = this.props;
    const { value, previousSubmission } = this.state;

    // TODO: Move this out of input
    const submittedClassName =
      previousSubmission === value ? "input-submitted" : "input-not-submitted";

    return (
      <input
        value={value}
        className={`${className} ${submittedClassName}`}
        onChange={this._onChange}
        onKeyDown={this._onKeyDown}
        {...otherProps}
      />
    );
  }
}

export default Input;
