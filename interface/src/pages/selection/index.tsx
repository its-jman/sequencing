import React, { PureComponent } from "react";

import styles from "./_selection.module.scss";
import { IAppProps } from "src/state/models";
import Query from "src/pages/selection/query";
import TableDataTable from "src/pages/selection/dataTable";
import Distribution from "src/pages/selection/dataTable/distribution";

class Selection extends PureComponent<IAppProps> {
  render() {
    const { datasets } = this.props.state;

    return (
      <div className={styles.container}>
        <Query />
        <TableDataTable datasets={datasets} />
      </div>
    );
  }
}

export default Selection;
