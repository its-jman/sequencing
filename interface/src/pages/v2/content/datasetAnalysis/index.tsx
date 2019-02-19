import React, { PureComponent } from "react";
import { Link } from "react-router-dom";

import containerStyles from "../_content.module.scss";
import styles from "./_analysis.module.scss";

import { IconButton } from "src/components";
import { FiArrowLeft } from "react-icons/fi";
import { IAlphabetDetails, IDataset } from "src/state/models";
import { getClassNames } from "src/components/utils";
import Distribution from "src/pages/v2/content/distribution";
import { Dispatch } from "redux";

type IDatasetAnalysisProps = {
  dataset: IDataset;
  alphabet: IAlphabetDetails;
  dispatch: Dispatch;
};

class Index extends PureComponent<IDatasetAnalysisProps> {
  render() {
    const { dataset, alphabet, dispatch } = this.props;

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

export default Index;
