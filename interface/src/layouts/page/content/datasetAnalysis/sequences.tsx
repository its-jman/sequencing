import React, { Dispatch, PureComponent, SetStateAction, useEffect, useState } from "react";
import { connect } from "react-redux";

import {
  IAppState,
  IDispatchProps,
  INetworkState,
  IPaginatedSequences,
  ISequence,
  NetworkStatus,
  SEQUENCES_PAGE_SIZE
} from "src/state/models";
import { actions } from "src/state/actions";

import styles from "./_sequences.module.scss";
import { getClassNames } from "src/components/utils";
import { isEmpty, range } from "src/utils";

type ISequencesProps = {
  id: string;
  paginatedSequences: IPaginatedSequences;
  network: INetworkState["sequences"]["id"];
  totalSequences: number;
} & IDispatchProps;

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

const useRenderPagination = (props: ISequencesProps) => {
  const { id, network, paginatedSequences, totalSequences, dispatch } = props;

  const maxPage = Math.ceil(totalSequences / RENDERED_PAGE_SIZE) - 1;
  const [page, setPage] = usePagination(maxPage);
  const [sequences, setSequences] = useState<ISequence[]>([]);

  useEffect(() => {
    const [begPage, endPage] = getBegEndPage(page);
    let isLoading = false;
    for (let i = begPage; i <= endPage; i++) {
      if (network[i] !== NetworkStatus.SUCCESS) {
        dispatch(actions.fetchSequences({ id, page: i }));
        if (!isLoading) isLoading = true;
      }
    }

    let sequences: ISequence[] = [];
    if (!isLoading) {
      const [begI, endI] = getBegEndI(page);
      const [begPage, endPage] = getBegEndPage(page);

      const begLocalI = begI % SEQUENCES_PAGE_SIZE;
      const endLocalI = endI % SEQUENCES_PAGE_SIZE;

      for (let i = begPage; i <= endPage; i++) {
        const page = paginatedSequences[i];
        if (isEmpty(page)) {
          throw new Error("Page is empty... Unknown...?");
        }

        const begPageLocalI = i === begPage ? begLocalI : 0;
        const endPageLocalI = i === endPage ? endLocalI : SEQUENCES_PAGE_SIZE;
        sequences.push(...page.slice(begPageLocalI, endPageLocalI + 1));
      }
      setSequences(sequences);
    }
  }, [id, network, page]);

  return {
    sequences,
    page,
    setPage,
    maxPage
  };
};

const SequencesList = (props: ISequencesProps) => {
  const { id, network, paginatedSequences, totalSequences, dispatch } = props;

  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState("");

  const { sequences, page, setPage, maxPage } = useRenderPagination(props);

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

export default connect<
  {
    paginatedSequences: IPaginatedSequences;
    network: INetworkState["sequences"]["id"];
    totalSequences: number;
  },
  IDispatchProps,
  { id: string },
  IAppState
>(
  (state, ownProps) => ({
    paginatedSequences: state.data.sequences[ownProps.id] || {},
    network: state.data.network.sequences[ownProps.id] || {},
    totalSequences: state.data.datasets[ownProps.id].analysis.record_count
  }),
  (dispatch) => ({ dispatch })
)(SequencesList);
