import React from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { FiArrowUp, FiBarChart2, FiChevronLeft, FiChevronRight, FiDisc } from "react-icons/fi";

import containerStyles from "../_content.module.scss";
import styles from "./_tableStyles.module.scss";

import Checkbox from "src/components/checkbox";
import { getClassNames } from "src/components/utils";
import { IAppState, IDataset, IDatasetsState } from "src/state/models";

interface IDataTableProps {
  datasets: IDataset[];
}
interface IDataTableState {
  page: number;
  maxPages: number;
}

class DataTable extends React.PureComponent<IDataTableProps, IDataTableState> {
  static pageSize = 8;
  static _getState = (props: IDataTableProps, page: number = 0) => ({
    page: page,
    maxPages: Math.ceil(props.datasets.length / DataTable.pageSize)
  });

  state = DataTable._getState(this.props);

  static getDerivedStateFromProps(nextProps: IDataTableProps, prevState: IDataTableState) {
    return DataTable._getState(nextProps, prevState.page);
  }

  setPage = (page: number) => {
    if (page < 0 || page >= this.state.maxPages || page === this.state.page) {
      console.warn(`Not setting page: ${page}`);
      return;
    }

    this.setState({
      ...this.state,
      page: page
    });
  };

  render() {
    const { datasets } = this.props;
    const { page, maxPages } = this.state;

    if (datasets.length === 0) {
      return <div className={styles.noResults}>{"No datasets found. Upload above... "}</div>;
    }

    const items = datasets.slice(page * DataTable.pageSize, (page + 1) * DataTable.pageSize);
    return (
      <div className={containerStyles.contentPanel}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.header}>
              <th />
              <th style={{ textAlign: "left" }}>Dataset</th>
              <th style={{ textAlign: "left" }}>Details</th>
              <th style={{ textAlign: "left" }}>Query</th>
              <th>Dist.</th>
            </tr>
          </thead>

          <tbody>
            {items.map((dataset) => (
              <TableItem key={dataset._id} dataset={dataset} />
            ))}
          </tbody>

          {maxPages > 1 && (
            <tfoot>
              <tr>
                <td colSpan={15} className={styles.footer}>
                  <div className={styles.pagination}>
                    <div className={styles.pageLink} onClick={() => this.setPage(page - 1)}>
                      <FiChevronLeft size={12} />
                    </div>
                    {new Array(maxPages).fill(null).map((_, i) => (
                      <div key={i} className={styles.pageLink} onClick={() => this.setPage(i)}>
                        {i + 1}
                      </div>
                    ))}
                    <div className={styles.pageLink} onClick={() => this.setPage(page + 1)}>
                      <FiChevronRight size={12} />
                    </div>
                  </div>
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    );
  }
}

class TableItem extends React.PureComponent<{ dataset: IDataset }> {
  render() {
    const { dataset } = this.props;

    return (
      <tr className={styles.row}>
        <td className={getClassNames(styles.col, styles.colSpace)}>
          <div className={styles.controlCol}>
            <Checkbox className={styles.datasetColExpander} size={20} />
          </div>
        </td>

        <td className={styles.col}>
          <div className={styles.datasetCol}>
            <Link className={styles.datasetColDetails} to={`/v2/${dataset._id}`}>
              <div className={styles.datasetColName}>{dataset.name}</div>
              <div className={styles.datasetColFilename}>{dataset.user_filename}</div>
            </Link>
          </div>
        </td>

        <td className={styles.col}>
          <div className={styles.infoCol}>
            <div className={styles.recordCount}>
              <FiDisc className={styles.recordCountIcon} size={24} />
              <span className={styles.recordCountNumber}>{dataset.analysis.record_count}</span>
              <span className={styles.recordCountText}>{"records"}</span>
            </div>
            {/*<div>{`${dataset.analysis.discarded_count} discarded`}</div>*/}
          </div>
        </td>

        <td className={styles.col}>
          <div className={styles.queryCol}>
            <span>
              <div>{"Stats"}</div>
              <div>{"#records"}</div>
            </span>
            <span>
              <FiArrowUp size={20} />
            </span>
          </div>
        </td>

        <td className={getClassNames(styles.col, styles.colSpace)}>
          <div className={styles.distributionCol}>
            <FiBarChart2 size={20} />
          </div>
        </td>
      </tr>
    );
  }
}

export default connect((state: IAppState) => ({
  datasets: Object.values(state.data.datasets)
}))(DataTable);
