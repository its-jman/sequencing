import React, { ReactElement, useContext, useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { reaction } from "mobx";

import { getClassNames as gcn, getRandomColor, usePagination } from "src/utils";
import { SequencesContext } from "src/state/stores/sequences";
import { UIContext } from "src/state/stores/ui";
import { IMatch, IRecord, ISequenceQueryAnalysis } from "src/state/models";

import { Selection } from "./selection";
import styles from "./_records.module.scss";
import { ArrowIcon } from "src/components/arrowIcon";
import { FiArrowLeft } from "react-icons/fi";

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

const RecordsListItem = React.memo<{
  sequence: IRecord;
  setSelection: (seq: IRecord) => void;
}>(({ sequence, setSelection }) => {
  return (
    <div className={styles.sequencesListItem}>
      <span className={styles.sequenceId} onClick={() => setSelection(sequence)}>
        {sequence.seq_id}
        {sequence.discarded && " - Discarded"}
      </span>
      <div className={styles.sequenceDescription}>{sequence.description}</div>
    </div>
  );
});

export const Records = observer<IOwnProps>(({ datasetId }) => {
  const uiStore = useContext(UIContext);
  const listContainer = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelection] = useState<IRecord | null>(null);
  const { page, setPage, maxPage, loading, sequences } = useNetworkPagination(datasetId);

  // This should never rerender.
  useEffect(() => {
    // prettier-ignore
    const disposer = reaction(
      () => uiStore.filter,
      () => { setPage(0); setSelection(null); },
      { name: "setFilter:resetSequencesPage" }
    );

    return () => disposer();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header} onClick={() => setOpen(!open)}>
        <ArrowIcon open={open} />
        <span>Records</span>
      </div>

      <div className={gcn(styles.content, open ? styles.contentOpen : styles.contentCollapsed)}>
        {selectedRecord !== null ? (
          <div className={styles.sequencesList}>
            <button onClick={() => setSelection(null)}>
              <FiArrowLeft size={28} />
            </button>
            <Selection record={selectedRecord} />
          </div>
        ) : (
          <div className={styles.sequencesList} ref={listContainer}>
            {loading ? (
              <div>Loading... </div>
            ) : sequences.length === 0 ? (
              <div>No items...</div>
            ) : (
              sequences.map((sequence, i) => (
                <RecordsListItem
                  key={sequence._id}
                  sequence={sequence}
                  setSelection={setSelection}
                />
              ))
            )}
            <div className={styles.paginationContainer}>
              <button
                onClick={() => {
                  if (setPage(page - 1)) {
                    listContainer.current!.scrollTo(0, 0);
                    setSelection(null);
                  }
                }}
              >
                prev
              </button>
              {" : "}
              <button
                onClick={() => {
                  if (setPage(page + 1)) {
                    listContainer.current!.scrollTo(0, 0);
                    setSelection(null);
                  }
                }}
              >
                next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
