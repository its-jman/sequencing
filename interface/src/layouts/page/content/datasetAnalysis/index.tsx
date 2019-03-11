import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { FiArrowLeft } from "react-icons/fi";
import { Link, Redirect, withRouter } from "react-router-dom";

import { getClassNames } from "src/components/utils";
import { IAppState, IDataset, IDispatchProps } from "src/state/models";

import containerStyles from "../_content.module.scss";
import Distribution from "../distribution";
import styles from "./_analysis.module.scss";
import Sequences from "src/layouts/page/content/datasetAnalysis/sequences";

type IDatasetAnalysisProps = {
  dataset: IDataset | null;
};

class DatasetAnalysis extends PureComponent<IDatasetAnalysisProps & IDispatchProps> {
  render() {
    const { dataset } = this.props;
    if (dataset === null) {
      return <Redirect to={"/v2"} />;
    }

    return (
      <div className={containerStyles.contentPanel}>
        <div className={styles.header}>
          <Link to={"/v2"} className={styles.backButton}>
            <button>
              <FiArrowLeft size={28} />
            </button>
          </Link>

          <div className={styles.datasetInfo}>
            <div className={getClassNames(styles.userText, styles.datasetName)}>{dataset.name}</div>
            <div className={styles.datasetFilename}>{dataset.user_filename}</div>
          </div>

          <div />
        </div>

        <div className={styles.content}>
          <Distribution dataset={dataset} />
          <Sequences datasetId={dataset._id} />
        </div>
      </div>
    );
  }
}

export default connect<IDatasetAnalysisProps, IDispatchProps, { datasetID: string }, IAppState>(
  (state: IAppState, ownProps) => ({
    dataset: state.data.datasets.datasets[ownProps.datasetID] || null
  }),
  (dispatch) => ({ dispatch })
)(DatasetAnalysis);
