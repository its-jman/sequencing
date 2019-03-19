import React, { useContext, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { Link, Redirect, RouteComponentProps } from "react-router-dom";
import { observer } from "mobx-react-lite";

import { getClassNames } from "src/utils";

import { DatasetsContext } from "src/state/stores/datasets";
import { isEmpty } from "src/utils";

import containerStyles from "../_content.module.scss";
import styles from "./_analysis.module.scss";
import { Sequences } from "./sequences";
import { Distribution } from "../distribution";

type IProps = {};
type IRouteProps = RouteComponentProps<{ datasetID: string }>;

export const DatasetAnalysis = observer(({ match }: IProps & IRouteProps) => {
  const ds = useContext(DatasetsContext);
  const [timeoutId, setTimeoutId] = useState<number | null>(null);
  const [redirect, setRedirect] = useState(false);
  const { datasetID } = match.params;
  const dataset = ds.datasets[datasetID];

  if (isEmpty(dataset)) {
    if (timeoutId === null) {
      const id = window.setTimeout(() => setRedirect(true), 3000);
      setTimeoutId(id);
    }

    return <div>{"Dataset is null, redirecting..."}</div>;
  } else if (timeoutId !== null) {
    console.log("Clearing timeout");
    window.clearTimeout(timeoutId);
    setTimeoutId(null);
  }

  if (redirect) {
    return <Redirect to={"/v2/"} />;
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
});
