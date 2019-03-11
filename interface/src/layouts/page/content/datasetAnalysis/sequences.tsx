import React, { useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";

import {
  IAppState,
  IDispatchProps,
  ISequence,
  ISequencesState,
  NetworkStatus,
  SEQUENCES_PAGE_SIZE
} from "src/state/models";

import styles from "./_sequences.module.scss";
import { getClassNames } from "src/components/utils";
import { actions } from "src/state/actions";
import { isEmpty } from "src/utils";
import { paramsMatch } from "src/state/reducers/data/sequences";

type IStateProps = {
  sequencesState: ISequencesState;
  totalSequences: number;
  queryId: string | null;
};

type IOwnProps = {
  datasetId: string;
};

type ISequencesProps = IOwnProps & IStateProps & IDispatchProps;

const RENDERED_PAGE_SIZE = 8;

const Header = ({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) => {
  return (
    <div className={styles.header} onClick={() => setOpen(!open)}>
      <div className={styles.arrowContainer}>
        <span className={getClassNames(styles.arrowIcon, open ? styles.arrowIconOpen : undefined)}>
          &#x25B6;
        </span>
      </div>
      <span>Sequences</span>
    </div>
  );
};

const getBegEndI = (page: number) => {
  const begI = page * RENDERED_PAGE_SIZE;
  const endI = begI + RENDERED_PAGE_SIZE - 1;

  return [begI, endI];
};

const getBegEndPage = (page: number) => {
  const [begI, endI] = getBegEndI(page);

  const begPage = Math.floor(begI / SEQUENCES_PAGE_SIZE);
  const endPage = Math.floor(endI / SEQUENCES_PAGE_SIZE);

  return [begPage, endPage];
};

const usePagination = (maxPage: number, initialPage: number = 0): [number, (p: number) => void] => {
  const [page, setPageRaw] = useState(initialPage);
  const setPage = (p: number): void => {
    if (p < 0 || p > maxPage) {
      console.warn(`Invalid page: ${p}`);
    } else {
      setPageRaw(p);
    }
  };

  return [page, setPage];
};

const useRenderPagination = (
  props: ISequencesProps & { queryId: string | null; filter: string | null }
) => {
  /*const [networkSequences, setNetworkSequences] = useState<{ [number: number]: ISequence[] }>({});
  const [sequences, setSequences] = useState<ISequence[]>([]);

    let sequences: ISequence[] = [];
    if (!isLoading) {
      const [begI, endI] = getBegEndI(page);
      const [begPage, endPage] = getBegEndPage(page);

      const begLocalI = begI % SEQUENCES_PAGE_SIZE;
      const endLocalI = endI % SEQUENCES_PAGE_SIZE;

      for (let i = begPage; i <= endPage; i++) {
        const page = sequencesState[i];
        if (isEmpty(page)) {
          throw new Error("Page is empty... Unknown...?");
        }

        const begPageLocalI = i === begPage ? begLocalI : 0;
        const endPageLocalI = i === endPage ? endLocalI : SEQUENCES_PAGE_SIZE;
        sequences.push(...page.slice(begPageLocalI, endPageLocalI + 1));
      }
    }
    setSequences(sequences);
  }, [datasetId, network, page]);*/
  const { datasetId, queryId, filter, sequencesState, totalSequences, dispatch } = props;

  const maxPage = Math.ceil(totalSequences / RENDERED_PAGE_SIZE) - 1;
  const [page, setPage] = usePagination(maxPage);

  const [begPage, endPage] = getBegEndPage(page);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const matches = paramsMatch(sequencesState, { queryId, filter, datasetId });
    let isLoading = false;
    for (let i = begPage; i <= endPage; i++) {
      // Unsent, Request, or Failure
      if (!matches || sequencesState.networkStatus[i] !== NetworkStatus.SUCCESS) {
        isLoading = true;
        const act = () =>
          dispatch(actions.fetchSequences({ datasetId, page: i, queryId: null, filter: null }));

        if (sequencesState.networkStatus[i] === NetworkStatus.FAILURE) {
          setTimeout(act, 10000);
        } else if (
          sequencesState.networkStatus[i] === NetworkStatus.UNSENT ||
          isEmpty(sequencesState.networkStatus[i]) ||
          !matches
        ) {
          act();
        }
        // else: NetworkStatus === Request -> Nothing to do.
      }
    }
    setLoading(isLoading);
  });

  let sequences: ISequence[] = [];
  if (!loading) {
    const [begI, endI] = getBegEndI(page);
    const [begPage, endPage] = getBegEndPage(page);

    const begLocalI = begI % SEQUENCES_PAGE_SIZE;
    const endLocalI = endI % SEQUENCES_PAGE_SIZE;

    for (let i = begPage; i <= endPage; i++) {
      const page = sequencesState.pages[i];
      if (isEmpty(page)) {
        console.error("Page is empty... Failure.");
        sequences = [];
        break;
        // throw new Error("Page is empty... Unknown...?");
      }

      const begPageLocalI = i === begPage ? begLocalI : 0;
      const endPageLocalI = i === endPage ? endLocalI : SEQUENCES_PAGE_SIZE;
      sequences.push(...page.slice(begPageLocalI, endPageLocalI + 1));
    }
  }

  return {
    page,
    setPage,
    sequences,
    maxPage
  };
};

const SequencesList = (props: ISequencesProps) => {
  const { datasetId, sequencesState, totalSequences, queryId, dispatch } = props;

  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [selection, setSelection] = useState("");

  const { page, setPage, maxPage, sequences } = useRenderPagination({
    ...props,
    queryId,
    filter: null
  });

  return (
    <div className={styles.container}>
      <Header open={open} setOpen={setOpen} />
      <div className={getClassNames(styles.content, open ? styles.contentCollapsed : undefined)}>
        <div className={styles.sequencesList}>
          {sequences.length === 0 ? (
            <div>Loading... </div>
          ) : (
            sequences.map((sequence, i) => (
              <div key={i} className={styles.sequencesListItem}>
                {sequence.id}
              </div>
            ))
          )}
          <div className={styles.paginationContainer}>
            <button onClick={() => setPage(page - 1)}>prev</button>
            {" : "}
            <button onClick={() => setPage(page + 1)}>next</button>
          </div>
        </div>
        <div className={styles.selection}>
          {selection !== "" ? <div className={styles.selection} /> : <div>Select a sequence</div>}
        </div>
      </div>
    </div>
  );
};

export default connect<IStateProps, IDispatchProps, IOwnProps, IAppState>(
  (state, ownProps) => ({
    sequencesState: state.data.sequences,
    network: state.data.sequences.networkStatus,
    totalSequences: state.data.datasets.datasets[ownProps.datasetId].analysis.record_count,
    queryId: state.ui.queryId
  }),
  (dispatch) => ({ dispatch })
)(SequencesList);
