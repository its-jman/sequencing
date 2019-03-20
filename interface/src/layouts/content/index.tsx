import React, { useCallback, useContext } from "react";
import { FiUpload, FiX } from "react-icons/fi";
import { Route, Switch } from "react-router-dom";
import { observer } from "mobx-react-lite";

import { UIContext } from "src/state/stores/ui";
import { QueriesContext } from "src/state/stores/queries";
import { ConfirmationType } from "src/state/constants";

import DatasetsTable from "./datasetsTable";
import { DatasetAnalysis } from "./datasetAnalysis";
import containerStyles from "../_layout.module.scss";
import styles from "./_content.module.scss";

const ContentHeader = observer(() => {
  const uiStore = useContext(UIContext);
  const queriesStore = useContext(QueriesContext);

  const _uploadClick = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();

    if (!uiStore.canResumeUpload) {
      uiStore.popupFileInput(true);
    } else {
      uiStore.showConfirmation(ConfirmationType.RESUME_UPLOAD);
    }
  }, [uiStore.canResumeUpload]);

  return (
    <div className={styles.header}>
      <div>
        {uiStore.filter.queryId !== null && (
          <>
            <span style={{ fontWeight: "bolder", marginRight: 8 }}>{"Query: "}</span>
            <div className={styles.filterPill}>
              {queriesStore.history[uiStore.filter.queryId].raw_pattern || "Unknown query..."}
              <FiX
                className={styles.x}
                size={18}
                onClick={() => uiStore.updateFilter({ queryId: null })}
              />
            </div>
          </>
        )}
        {uiStore.filter.descFilter !== null && (
          <>
            <span style={{ fontWeight: "bolder", marginRight: 8, marginLeft: 16 }}>
              {"Description: "}
            </span>
            <div className={styles.filterPill}>
              {uiStore.filter.descFilter}
              <FiX
                className={styles.x}
                size={18}
                onClick={() => uiStore.updateFilter({ descFilter: null })}
              />
            </div>
          </>
        )}
      </div>
      <div className={styles.headerButtonsContainer}>
        <button
          className={`btn btn-2`}
          style={{ marginLeft: 12, marginRight: 12 }}
          onClick={() => {
            fetch("http://localhost:5000/clear").then((resp) => {
              console.warn("Clearing data...");
              console.warn(resp);
              location.reload();
            });
          }}
        >
          Clear All
        </button>
        <button className={`btn btn-2`} onClick={_uploadClick}>
          <FiUpload className={styles.uploadIcon} />
          {" Upload"}
        </button>
      </div>
    </div>
  );
});

export default () => (
  <div className={containerStyles.content}>
    <ContentHeader />
    <Switch>
      <Route exact={true} path={`/v2/`} component={DatasetsTable} />
      <Route path={`/v2/:datasetID`} component={DatasetAnalysis} />
    </Switch>
  </div>
);
