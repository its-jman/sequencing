import React, { useCallback, useContext } from "react";
import { FiUpload, FiX } from "react-icons/fi";
import { Route, Switch } from "react-router-dom";
import { observer } from "mobx-react-lite";

import { ControlledFileInput } from "src/components/controlledFileInput";
import { ConfirmationType, ModalType } from "src/state/constants";
import { UIContext } from "src/state/stores/ui";

import DatasetsTable from "./datasetsTable";
import { DatasetAnalysis } from "./datasetAnalysis";

import containerStyles from "../_layout.module.scss";
import styles from "./_content.module.scss";
import { QueriesContext } from "src/state/stores/queries";

const ContentHeader = observer(() => {
  const uiStore = useContext(UIContext);
  const queriesStore = useContext(QueriesContext);

  const _uploadClick = useCallback(() => {
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
              {queriesStore.history[uiStore.filter.queryId] || "Unknown query..."}
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
            });
          }}
        >
          Clear All
        </button>

        <button className={`btn btn-2`} onClick={_uploadClick}>
          <ControlledFileInput /> {/* display: none; */}
          <FiUpload className={styles.uploadIcon} />
          <span>{" Upload"}</span>
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
