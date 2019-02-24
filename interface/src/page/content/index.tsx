import React, { PureComponent } from "react";
import { FiUpload } from "react-icons/fi";
import { connect } from "react-redux";
import { Route, RouteComponentProps, Switch, withRouter } from "react-router-dom";

import { actions } from "src/state/actions";
import { ConfirmationType, ModalType } from "src/state/actions";
import { IAppState, IDispatchProps } from "src/state/models";
import ControlledFileInput from "src/components/controlledFileInput";

import styles from "./_content.module.scss";
import DatasetsTable from "./datasetsTable";
import DatasetAnalysis from "./datasetAnalysis";

type IContentHeaderProps = {
  canResumeUpload: boolean;
};

class ContentHeader extends React.PureComponent<IContentHeaderProps & IDispatchProps> {
  _uploadClick = () => {
    const { dispatch, canResumeUpload } = this.props;

    if (canResumeUpload) {
      const resolve = () => {
        dispatch(actions.setModal({ modalType: ModalType.UPLOAD_MANAGER, status: true }));
      };

      const reject = () => {
        dispatch(actions.selectFiles([]));
        dispatch(actions.setFileInput({ status: true }));
      };

      dispatch(
        actions.showConfirmation({
          confirmationType: ConfirmationType.RESUME_UPLOAD,
          params: { resolve, reject }
        })
      );
    } else {
      dispatch(actions.setFileInput({ status: true }));
    }
  };

  render() {
    return (
      <div className={styles.header}>
        <ControlledFileInput />
        <button className={`btn btn-2`} onClick={this._uploadClick}>
          <FiUpload className={styles.uploadIcon} />
          <span>{" Upload"}</span>
        </button>
      </div>
    );
  }
}

const ControlledContentHeader = connect(
  (state: IAppState) => ({
    canResumeUpload: state.ui.fileInput.files.length > 0
  }),
  (dispatch) => ({ dispatch })
)(ContentHeader);

class ContentBody extends React.PureComponent<RouteComponentProps> {
  render() {
    return (
      <Switch>
        <Route exact={true} path={`/v2/`} component={DatasetsTable} />
        <Route
          path={`/v2/:datasetID`}
          render={(props) => {
            const { datasetID } = props.match.params;

            return <DatasetAnalysis datasetID={datasetID} />;
          }}
        />
      </Switch>
    );
  }
}

const ControlledContentBody = withRouter(ContentBody);

class Content extends PureComponent {
  render() {
    return (
      <>
        <ControlledContentHeader />
        <ControlledContentBody />
      </>
    );
  }
}

// @ts-ignore
export default withRouter(Content);
