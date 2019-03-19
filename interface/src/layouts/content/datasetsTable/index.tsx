import React, { useContext } from "react";
import { observer } from "mobx-react-lite";

import { DatasetsContext } from "src/state/stores/datasets";
import { usePagination } from "src/utils";
import { Pagination } from "src/components/pagination";

import containerStyles from "../_content.module.scss";
import styles from "./_tableStyles.module.scss";
import { columnMap } from "./columns";

const PAGE_SIZE = 8;
const DataTable2 = observer(() => {
  const store = useContext(DatasetsContext);
  const maxPage = Math.ceil(Object.keys(store.datasets).length / PAGE_SIZE);
  const [page, setPage] = usePagination(maxPage);

  const visibleDatasets = store.datasetsList.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  if (visibleDatasets.length === 0) {
    return <div className={styles.noResults}>{"No datasetSequences found. Upload above... "}</div>;
  }

  return (
    <div className={containerStyles.contentPanel}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.header}>
            {columnMap.map(([Col], i) => (
              <Col key={i} />
            ))}
          </tr>
        </thead>
        <tbody>
          {visibleDatasets.map((dataset) => (
            <tr key={dataset._id} className={styles.row}>
              {columnMap.map(([_, Col], i) => (
                <Col key={i} dataset={dataset} />
              ))}
            </tr>
          ))}
        </tbody>

        {maxPage > 1 && (
          <tfoot>
            <tr>
              <td colSpan={15} className={styles.footer}>
                <Pagination page={page} setPage={setPage} maxPage={maxPage} />
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
});

export default DataTable2;
