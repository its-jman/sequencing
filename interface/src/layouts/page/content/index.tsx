import React from "react";
import { FiUpload } from "react-icons/fi";
import { connect } from "react-redux";
import { Route, RouteComponentProps, Switch, withRouter } from "react-router-dom";

import { IAppState, IDispatchProps, NetworkStatus } from "src/state/models";
import ControlledFileInput from "src/components/controlledFileInput";

import styles from "./_content.module.scss";
import DatasetsTable from "./datasetsTable";
import DatasetAnalysis from "./datasetAnalysis";
import { actions } from "src/state/actions";
import { ConfirmationType, ModalType } from "src/state/constants";

type IContentHeaderProps = {
  canResumeUpload: boolean;
};

class ContentHeaderRaw extends React.PureComponent<IContentHeaderProps & IDispatchProps> {
  _uploadClick = () => {
    const { dispatch, canResumeUpload } = this.props;

    if (canResumeUpload) {
      const resolve = () => {
        dispatch(actions.setModal({ modalType: ModalType.UPLOAD_MANAGER, status: true }));
      };

      const reject = () => {
        dispatch(actions.selectFile(null));
        dispatch(actions.popupFileInput({ status: true }));
      };

      dispatch(
        actions.showConfirmation({
          confirmationType: ConfirmationType.RESUME_UPLOAD,
          params: { resolve, reject }
        })
      );
    } else {
      dispatch(actions.popupFileInput({ status: true }));
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

const ContentHeader = connect(
  (state: IAppState) => ({
    canResumeUpload:
      state.ui.uploadManager.upload !== null &&
      // Filter by if there are uploads that aren't successful
      state.ui.uploadManager.upload.status !== NetworkStatus.SUCCESS
  }),
  (dispatch) => ({ dispatch })
)(ContentHeaderRaw);

class ContentBodyRaw extends React.PureComponent<RouteComponentProps> {
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

const ContentBody = withRouter(ContentBodyRaw);

export default () => (
  <>
    <ContentHeader />
    <ContentBody />
  </>
);
