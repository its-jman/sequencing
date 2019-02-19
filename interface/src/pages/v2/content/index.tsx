import React, { PureComponent } from "react";
import { FiUpload } from "react-icons/fi";
import {
  Switch,
  Route,
  withRouter,
  RouteComponentProps,
  RouteProps,
  Redirect
} from "react-router-dom";

import styles from "./_content.module.scss";
import DatasetsTable from "./datasetsTable";
import DatasetAnalysis from "./datasetAnalysis";

import * as actions from "src/state/actions";
import { modalIDs } from "src/state/actions";
import { IAppProps } from "src/state/models";
import { connect } from "src/state/connect";
import UploadModal from "src/pages/v2/components/uploadModal";

type IContentProps = IAppProps & RouteComponentProps;

class Content extends PureComponent<IContentProps> {
  render() {
    const { match, state, dispatch } = this.props;

    return (
      <>
        <div className={styles.header}>
          <button
            className={`btn btn-2`}
            onClick={() => dispatch(actions.setModal({ modalID: modalIDs.upload, status: true }))}
          >
            <FiUpload className={styles.uploadIcon} />
            <span>{" Upload"}</span>
          </button>
        </div>

        <Switch>
          <Route
            exact={true}
            path={`${match.path}/`}
            render={(props) => <DatasetsTable datasets={state.datasets} />}
          />
          <Route
            path={`${match.path}/:datasetId`}
            render={(props) => {
              const { datasetId } = props.match.params;
              const dataset = state.datasets.data[datasetId];

              if (!dataset) return <Redirect to={"/v2"} />;
              return (
                <DatasetAnalysis
                  dataset={dataset}
                  alphabet={state.alphabet.data}
                  dispatch={this.props.dispatch}
                />
              );
            }}
          />
        </Switch>
      </>
    );
  }
}

// @ts-ignore
export default withRouter(connect(Content));
