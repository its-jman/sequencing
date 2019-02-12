import React from "react";

import { IDatasetsState } from "src/state/models";

import ListItem from "./listItem";
import styles from "./_sidebar.module.scss";

class Sidebar extends React.PureComponent<{ datasets: IDatasetsState }> {
  render() {
    const { datasets } = this.props;
    return (
      <div className={styles.sidebar}>
        <ul>
          {Object.values(datasets).map((dataset, i) => (
            <ListItem key={i} dataset={dataset} />
          ))}
        </ul>
      </div>
    );
  }
}

export default Sidebar;
