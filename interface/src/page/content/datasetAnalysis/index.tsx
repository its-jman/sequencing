import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { FiArrowLeft } from "react-icons/fi";
import { Link, Redirect } from "react-router-dom";

import { getClassNames } from "src/components/utils";
import { IAlphabetDetails, IAppState, IDataset, IDispatchProps } from "src/state/models";

import containerStyles from "../_content.module.scss";
import Distribution from "../distribution";
import styles from "./_analysis.module.scss";

type IDatasetAnalysisProps = {
  dataset: IDataset | null;
  alphabet: IAlphabetDetails;
};

class DatasetAnalysis extends PureComponent<IDatasetAnalysisProps & IDispatchProps> {
  render() {
    const { dataset, alphabet, dispatch } = this.props;
    if (dataset === null) {
      return <Redirect to={"/v2"} />;
    }

    return (
      <div className={containerStyles.contentPanel}>
        <div className={styles.header}>
          <Link to={"/v2/"} className={styles.backButton}>
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
          <Distribution dataset={dataset} alphabet={alphabet} dispatch={dispatch} />
        </div>
      </div>
    );
  }
}

export default connect<IDatasetAnalysisProps, IDispatchProps, { datasetID: string }, IAppState>(
  (state: IAppState, ownProps) => ({
    dataset: state.datasets.data[ownProps.datasetID] || null,
    alphabet: state.alphabet.data || undefined
  }),
  (dispatch) => ({ dispatch })
)(DatasetAnalysis);
