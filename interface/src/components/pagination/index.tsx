import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import styles from "./_pagination.module.scss";

type IProps = {
  page: number;
  setPage: (p: number) => void;
  maxPage: number;
};

export const Pagination = React.memo(({ page, setPage, maxPage }: IProps) => {
  return (
    <div className={styles.pagination}>
      <div className={styles.pageLink} onClick={() => setPage(page - 1)}>
        <FiChevronLeft size={12} />
      </div>
      {new Array(maxPage).fill(null).map((_, i) => (
        <div key={i} className={styles.pageLink} onClick={() => setPage(i)}>
          {i + 1}
        </div>
      ))}
      <div className={styles.pageLink} onClick={() => setPage(page + 1)}>
        <FiChevronRight size={12} />
      </div>
    </div>
  );
});
