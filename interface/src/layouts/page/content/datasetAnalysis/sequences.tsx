import React, { useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";

import {
  IAppState,
  IDispatchProps,
  ISequence,
  ISequencesFilter,
  ISequencesState,
  NETWORK_PAGE_SIZE,
  NetworkStatus
} from "src/state/models";

import styles from "./_sequences.module.scss";
import { getClassNames } from "src/components/utils";
import { actions } from "src/state/actions";
import { isEmpty, range } from "src/utils";
import { paramsMatch } from "src/state/reducers/data/sequences";
import { networkActions } from "src/state/actions/network";

type IStateProps = {
  sequencesState: ISequencesState;
  queryId: string | null;
};

type IOwnProps = {
  datasetId: string;
};

type ISequencesProps = IOwnProps & IStateProps & IDispatchProps;

const RENDERED_PAGE_SIZE = 8;

const useRenderPagination = (
  maxPage: number,
  initialPage: number = 0
): [number, (p: number) => void] => {
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

const getNetworkPages = (page: number): [number[], [number, number]] => {
  const begI = page * RENDERED_PAGE_SIZE;
  const endI = begI + RENDERED_PAGE_SIZE - 1;

  const begPage = Math.floor(begI / NETWORK_PAGE_SIZE);
  const endPage = Math.floor(endI / NETWORK_PAGE_SIZE);

  return [range(begPage, endPage), [begI, endI]];
};

const useNetworkPagination = ({
  sequencesFilter,
  sequencesState,
  dispatch
}: {
  sequencesFilter: ISequencesFilter;
  sequencesState: ISequencesState;
} & IDispatchProps) => {
  const doesMatch = paramsMatch(sequencesState, sequencesFilter);
  const maxRenderedPage =
    doesMatch && sequencesState.total_count !== -1
      ? Math.ceil(sequencesState.total_count / RENDERED_PAGE_SIZE) - 1
      : -1;

  const [renderedPage, setRenderedPage] = useRenderPagination(maxRenderedPage);
  const [networkPages, [begI, endI]] = getNetworkPages(renderedPage);
  const loading =
    !doesMatch ||
    networkPages
      .map((i) => sequencesState.networkStatus[i] !== NetworkStatus.SUCCESS)
      .reduce((p, c) => p || c);

  // iterate over each page and ensure the page has been requested.
  useEffect(() => {
    const act = (page: number) => dispatch(actions.fetchSequences({ ...sequencesFilter, page }));
    networkPages.forEach((page) => {
      const ns = sequencesState.networkStatus[page];
      if (!doesMatch || isEmpty(ns) || ns === NetworkStatus.UNSENT) {
        act(page);
      } else if (ns === NetworkStatus.FAILURE) {
        setTimeout(() => act(page), 10000);
      }
    });
  });

  // map the network sequences into the output. If any of the pages are loading, return an empty arr
  let sequences: ISequence[] = [];
  if (!loading) {
    try {
      networkPages.forEach((i) => {
        const page = sequencesState.pages[i];
        if (isEmpty(page)) throw new Error("Page is empty... Failure.");

        let [pageStart, pageEnd] = [0, NETWORK_PAGE_SIZE];
        if (i === networkPages[0]) pageStart = begI % NETWORK_PAGE_SIZE;
        if (i === networkPages[networkPages.length - 1]) pageEnd = endI % NETWORK_PAGE_SIZE;

        sequences.push(...page.slice(pageStart, pageEnd + 1));
      });
    } catch (e) {
      console.warn(e.toString());
      sequences = [];
    }
  }

  return {
    page: renderedPage,
    setPage: setRenderedPage,
    maxPage: maxRenderedPage,
    sequences
  };
};

const SequencesList = (props: ISequencesProps) => {
  const { datasetId, sequencesState, queryId, dispatch } = props;

  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);
  const [selection, setSelection] = useState("");

  const sequencesFilter = { queryId, filter, datasetId };
  const { page, setPage, maxPage, sequences } = useNetworkPagination({
    sequencesFilter,
    sequencesState,
    dispatch
  });

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
          {sequences.length === 0 ? (
            <div>Loading... </div>
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

        <div className={styles.selection}>
          {selection === "" ? (
            <div>Select a sequence...</div>
          ) : (
            <div className={styles.selection} />
          )}
        </div>
      </div>
    </div>
  );
};

export default connect<IStateProps, IDispatchProps, IOwnProps, IAppState>(
  (state, ownProps) => ({
    sequencesState: state.data.sequences,
    network: state.data.sequences.networkStatus,
    queryId: state.ui.queryId
  }),
  (dispatch) => ({ dispatch })
)(SequencesList);
