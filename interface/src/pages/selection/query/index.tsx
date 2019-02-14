import React from "react";

import containerStyles from "../_selection.module.scss";
import styles from "./_query.module.scss";
import Button from "src/components/button/button";

class Query extends React.PureComponent {
  render() {
    return (
      <div className={containerStyles.query}>
        <input type="text" />
      </div>
    );
  }
}

export default Query;
