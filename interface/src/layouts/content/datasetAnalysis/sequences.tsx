import React, { useContext, useEffect, useState } from "react";

import { getClassNames, usePagination } from "src/utils";

import styles from "./_sequences.module.scss";
import { observer } from "mobx-react-lite";
import { SequencesContext } from "src/state/stores/sequences";
import { UIContext } from "src/state/stores/ui";
import { reaction } from "mobx";

type IOwnProps = {
  datasetId: string;
};

const RENDERED_PAGE_SIZE = 8;

const useNetworkPagination = (datasetId: string) => {
  const sequencesStore = useContext(SequencesContext);
  const dsCache = sequencesStore.getDSCache(datasetId);

  const maxRenderedPage =
    dsCache.totalCount !== null ? Math.ceil(dsCache.totalCount / RENDERED_PAGE_SIZE) - 1 : 0;
  const [renderedPage, setRenderedPage] = usePagination(maxRenderedPage);

  const start = renderedPage * RENDERED_PAGE_SIZE;
  const end = start + RENDERED_PAGE_SIZE - 1;

  const { loading, sequences } = dsCache.getSequences({ start, end });

  return {
    page: renderedPage,
    setPage: setRenderedPage,
    maxPage: maxRenderedPage,
    loading,
    sequences
  };
};

export const Sequences = observer<IOwnProps>(({ datasetId }) => {
  const uiStore = useContext(UIContext);
  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState("");
  const { page, setPage, maxPage, loading, sequences } = useNetworkPagination(datasetId);

  // This should never rerender.
  useEffect(() => {
    // prettier-ignore
    const disposer = reaction(
      () => uiStore.filter,
      () => { setPage(0); },
      { name: "setFilter:resetSequencesPage" }
    );

    return () => disposer();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header} onClick={() => setOpen(!open)}>
        <div className={styles.arrowContainer}>
          <span
            className={getClassNames(styles.arrowIcon, open ? styles.arrowIconOpen : undefined)}
          >
            &#x25B6;
          </span>
        </div>
        <span>Sequences</span>
      </div>

      <div className={getClassNames(styles.content, open ? styles.contentCollapsed : undefined)}>
        <div className={styles.sequencesList}>
          {loading ? (
            <div>Loading... </div>
          ) : sequences.length === 0 ? (
            <div>No items...</div>
          ) : (
            sequences.map((sequence, i) => (
              <div key={i} className={styles.sequencesListItem}>
                {sequence.seq_id}
              </div>
            ))
          )}
          <div className={styles.paginationContainer}>
            <button onClick={() => setPage(page - 1)}>prev</button>
            {" : "}
            <button onClick={() => setPage(page + 1)}>next</button>
          </div>
        </div>

        {/*<div className={styles.selection}>
          {selection === "" ? (
            <div>Select a sequence...</div>
          ) : (
            <div className={styles.selection} />
          )}
        </div>*/}
      </div>
    </div>
  );
});
