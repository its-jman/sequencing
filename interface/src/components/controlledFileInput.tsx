import React, { ChangeEvent } from "react";
import { connect } from "react-redux";

import { IAppState, IDispatchProps } from "src/state/models";
import { ModalType } from "src/state/constants";
import { actions } from "src/state/actions";
import { isEmpty } from "src/utils";

type IControlledFileInputProps = { shouldOpen: boolean } & IDispatchProps;

class ControlledFileInput extends React.PureComponent<IControlledFileInputProps> {
  fileInput: HTMLInputElement | null = null;
  _onChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!this.fileInput!.files) {
      console.warn("File Input files is null");
      return;
    }

    const file = this.fileInput!.files[0];
    // `File` is a custom object which is not enumerable through traditional Object means.
    if (file === null || file === undefined || file.name.length === 0) {
      console.warn('File is "empty"');
      console.log(file);
    } else {
      const { dispatch } = this.props;
      dispatch(actions.selectFile(this.fileInput!.files[0]));
      dispatch(actions.setModal({ modalType: ModalType.UPLOAD_MANAGER, status: true }));
    }
  };

  _tryOpen = (props: IControlledFileInputProps) => {
    const { dispatch, shouldOpen } = props;
    if (shouldOpen) {
      this.fileInput!.click();
      dispatch(actions.popupFileInput({ status: false }));
    }
  };
  componentWillMount() {
    this._tryOpen(this.props);
  }
  componentWillUpdate(nextProps: Readonly<IControlledFileInputProps>) {
    this._tryOpen(nextProps);
  }

  render() {
    return (
      <input
        type="file"
        style={{ display: "none" }}
        value={""}
        onChange={this._onChange}
        multiple={false}
        ref={(inp) => (this.fileInput = inp)}
      />
    );
  }
}

export default connect((state: IAppState) => ({
  shouldOpen: state.ui.uploadManager.shouldOpenFI
}))(ControlledFileInput);
