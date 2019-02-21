import React, { PureComponent } from "react";
import { connect } from "react-redux";

import styles from "./_ClearUpload.module.scss";
import { IConfirmationParams, IDispatchProps } from "src/state/models";
import * as actions from "src/state/actions";
import { ConfirmationType } from "src/state/actions";

class ClearUpload extends PureComponent<IConfirmationParams & IDispatchProps> {
  _onClick = (fn: () => void) => () => {
    this.props.dispatch(
      actions.clearConfirmation({ confirmationType: ConfirmationType.RESUME_UPLOAD })
    );
    fn();
  };

  render() {
    const { resolve, reject } = this.props;

    return (
      <div className={styles.container}>
        <div className={styles.body}>
          {"You already have uploads in progress, would you like to resume the upload?"}
        </div>
        <div className={styles.footer}>
          <button onClick={this._onClick(reject)} className={styles.clearButton}>
            Clear uploads
          </button>
          <button onClick={this._onClick(resolve)} className={styles.resumeButton}>
            Resume
          </button>
        </div>
      </div>
    );
  }
}

export default connect(
  () => ({}),
  (dispatch) => ({ dispatch })
)(ClearUpload);
