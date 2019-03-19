import React from "react";
import { FiArrowUp, FiBarChart2, FiDisc } from "react-icons/fi";
import { Link } from "react-router-dom";

import { getClassNames } from "src/utils";
import Checkbox from "src/components/checkbox";
import { IDataset } from "src/state/models";

import styles from "./_tableStyles.module.scss";

type IColProps = {
  dataset: IDataset;
};

const CheckboxHeader = React.memo(() => <th />);
const CheckboxCol = React.memo<IColProps>(() => (
  <td className={getClassNames(styles.col, styles.colSpace)}>
    <div className={styles.controlCol}>
      <Checkbox className={styles.datasetColExpander} size={20} />
    </div>
  </td>
));

const DatasetHeader = React.memo(() => <th className={styles.leftHeader}>Dataset</th>);
const DatasetCol = React.memo<IColProps>(({ dataset }) => {
  return (
    <td className={styles.col}>
      <div className={styles.datasetCol}>
        <Link className={styles.datasetColDetails} to={`/v2/${dataset._id}`}>
          <div className={styles.datasetColName}>{dataset.name}</div>
          <div className={styles.datasetColFilename}>{dataset.user_filename}</div>
        </Link>
      </div>
    </td>
  );
});

const DetailsHeader = React.memo(() => <th className={styles.leftHeader}>Details</th>);
const DetailsCol = React.memo<IColProps>(({ dataset }: { dataset: IDataset }) => {
  return (
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
  );
});

const QueryHeader = React.memo(() => <th className={styles.leftHeader}>Query</th>);
const QueryCol = React.memo<IColProps>(({ dataset }) => {
  return (
    <td className={styles.col}>
      <div className={styles.queryCol}>
        <span>
          <div>{"Stats"}</div>
          <div>{"#records"}</div>
          {/*<FiSearch size={22} />*/}
          {/*<FiFilter size={22} />*/}
        </span>
        <span>
          <FiArrowUp size={20} />
        </span>
      </div>
    </td>
  );
});

const DistHeader = React.memo(() => <th>Dist.</th>);
const DistCol = React.memo<IColProps>(({ dataset }) => {
  return (
    <td className={getClassNames(styles.col, styles.colSpace)}>
      <div className={styles.distributionCol}>
        <FiBarChart2 size={20} />
      </div>
    </td>
  );
});

export const columnMap: [React.FC, React.FC<IColProps>][] = [
  [CheckboxHeader, CheckboxCol],
  [DatasetHeader, DatasetCol],
  [DetailsHeader, DetailsCol],
  [QueryHeader, QueryCol],
  [DistHeader, DistCol]
];
