import React, { ChangeEvent } from "react";
import { connect } from "react-redux";

import { IAppState, IDispatchProps } from "src/state/models";
import { actions, ModalType } from "src/state/actions";

type IControlledFileInputProps = { shouldOpen: boolean } & IDispatchProps;

class ControlledFileInput extends React.PureComponent<IControlledFileInputProps> {
  fileInput: HTMLInputElement | null = null;
  _onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { dispatch } = this.props;
    dispatch(actions.selectFiles([...this.fileInput!.files]));
    dispatch(actions.setModal({ modalType: ModalType.UPLOAD_MANAGER, status: true }));
  };

  _tryOpen = (props: IControlledFileInputProps) => {
    const { dispatch, shouldOpen } = props;
    if (shouldOpen) {
      this.fileInput!.click();
      dispatch(actions.setFileInput(false));
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
        multiple={true}
        ref={(inp) => (this.fileInput = inp)}
      />
    );
  }
}

export default connect((state: IAppState) => ({
  shouldOpen: state.ui.fileInput.shouldOpen
}))(ControlledFileInput);
