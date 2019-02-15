import React from "react";
import { FiUpload, FiArrowUp, FiBarChart2 } from "react-icons/fi";

import { IDataset, IDatasetsState } from "src/state/models";
import Checkbox from "src/components/checkbox";
import DateComponent from "src/components/date";

import containerStyles from "../_selection.module.scss";
import styles from "./_dataTable.module.scss";
import tableStyles from "./_tableStyles.module.scss";
import { getClassNames } from "src/components/utils";
import Distribution from "src/pages/selection/dataTable/distribution";

class TableItem extends React.PureComponent<{ dataset: IDataset }> {
  render() {
    const { dataset } = this.props;

    return (
      <tr className={tableStyles.row}>
        <td className={getClassNames(tableStyles.col, tableStyles.colSpace)}>
          <Checkbox className={tableStyles.datasetColExpander} size={20} />
        </td>

        <td className={tableStyles.col}>
          <div className={tableStyles.datasetCol}>
            {/*<IconButton
              className={tableStyles.datasetColExpander}
              icon={FiChevronRight}
              size={28}
            />*/}
            <div className={tableStyles.datasetColDetails}>
              <div className={tableStyles.datasetColName}>{dataset.name}</div>
              <div className={tableStyles.datasetColFilename}>{dataset.user_filename}</div>
              {/*<DateComponent className={tableStyles.datasetColDate} date={dataset.upload_time} />*/}
            </div>
          </div>
        </td>

        <td className={tableStyles.col}>
          <div className={tableStyles.infoCol}>
            <div>{`${dataset.analysis.record_count} records`}</div>
            <div>{`${dataset.analysis.discarded_count} discarded`}</div>
          </div>
        </td>

        <td className={tableStyles.col}>
          <div className={tableStyles.queryCol}>
            <span>
              <div>{"Stats"}</div>
              <div>{"#records"}</div>
            </span>
            <span>
              <FiArrowUp size={20} />
            </span>
          </div>
        </td>

        <td className={getClassNames(tableStyles.col, tableStyles.colSpace)}>
          <div className={tableStyles.distributionCol}>
            <FiBarChart2 size={20} />
          </div>
        </td>
      </tr>
    );
  }
}

class DataTable extends React.PureComponent<{ datasets: IDatasetsState }> {
  render() {
    const { datasets } = this.props;

    return (
      <div className={containerStyles.dataTable}>
        <Distribution />
        <div className={styles.header}>
          <button className={`btn btn-2 ${styles.button}`}>
            <FiUpload className={styles.buttonIcon} />
            <span className={styles.buttonText}>{" Upload"}</span>
          </button>
        </div>

        <div className={styles.content}>
          <table className={styles.table}>
            <thead>
              <tr className={tableStyles.header}>
                {/*<th />*/}
                <th />
                <th style={{ textAlign: "left" }}>Dataset</th>
                <th style={{ textAlign: "left" }}>Details</th>
                <th>Query</th>
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
      </div>
    );
  }
}

export default DataTable;
