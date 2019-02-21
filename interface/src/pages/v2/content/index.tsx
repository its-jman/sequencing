import React, { PureComponent } from "react";
import { FiUpload } from "react-icons/fi";
import { Route, RouteComponentProps, Switch, withRouter } from "react-router-dom";

import styles from "./_content.module.scss";
import DatasetsTable from "./datasetsTable";
import DatasetAnalysis from "./datasetAnalysis";

import * as actions from "src/state/actions";
import { ConfirmationType, ModalType } from "src/state/actions";
import { IAppState, IDispatchProps } from "src/state/models";
import { connect } from "react-redux";

type IContentHeaderProps = {
  canResumeUpload: boolean;
};

class ContentHeader extends React.PureComponent<IContentHeaderProps & IDispatchProps> {
  fileInput: HTMLInputElement | null = null;

  _uploadClick = () => {
    const { dispatch, canResumeUpload } = this.props;

    if (canResumeUpload) {
      const resolve = () => {
        dispatch(actions.setModal({ modalType: ModalType.UPLOAD_MANAGER, status: true }));
      };

      const reject = () => {
        if (this.fileInput === null) {
          console.error("ContentHeader.fileInput === null");
        } else {
          dispatch(actions.selectFiles({ files: [] }));
          this.fileInput.click();
        }
      };

      dispatch(
        actions.showConfirmation({
          confirmationType: ConfirmationType.RESUME_UPLOAD,
          params: { resolve, reject }
        })
      );
    } else {
      if (this.fileInput === null) {
        console.error("ContentHeader.fileInput === null");
      } else {
        this.fileInput.click();
      }
    }
  };

  _handleFiles = () => {
    if (this.fileInput === null) {
      console.error("ContentHeader.fileInput === null");
    } else {
      const { dispatch } = this.props;
      const files: Array<File> = this.fileInput.files !== null ? [...this.fileInput.files] : [];
      dispatch(actions.selectFiles({ files }));
      dispatch(actions.setModal({ modalType: ModalType.UPLOAD_MANAGER, status: true }));
    }
  };

  render() {
    return (
      <div className={styles.header}>
        <input
          type="file"
          style={{ display: "none" }}
          onChange={this._handleFiles}
          ref={(inp) => (this.fileInput = inp)}
        />
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
    canResumeUpload: state.upload.files.length > 0
  }),
  (dispatch) => ({ dispatch })
)(ContentHeader);

class ContentBody extends React.PureComponent<RouteComponentProps> {
  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route exact={true} path={`${match.path}/`} component={DatasetsTable} />
        <Route
          path={`${match.path}/:datasetID`}
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

export default Content;
