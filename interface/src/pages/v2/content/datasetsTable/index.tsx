import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { FiArrowUp, FiBarChart2 } from "react-icons/fi";

import containerStyles from "../_content.module.scss";
import styles from "./_tableStyles.module.scss";

import Checkbox from "src/components/checkbox";
import { getClassNames } from "src/components/utils";
import { IAppState, IDataset, IDatasetsState } from "src/state/models";

class DataTable extends React.PureComponent<{ datasets: IDatasetsState }> {
  render() {
    const { datasets } = this.props;

    if (Object.keys(datasets.data).length === 0) {
      return <div className={styles.noResults}>{"No datasets found. Upload above... "}</div>;
    }

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
            {Object.values(datasets.data).map((dataset, i) => (
              <TableItem key={i} dataset={dataset} />
            ))}
          </tbody>
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
            <div>{`${dataset.analysis.record_count} records`}</div>
            <div>{`${dataset.analysis.discarded_count} discarded`}</div>
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
  datasets: state.datasets
}))(DataTable);
