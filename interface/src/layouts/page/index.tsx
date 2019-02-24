import React from "react";

import Query from "./query";
import Content from "./content";
import styles from "./_page.module.scss";
import { withRouter } from "react-router-dom";

const Page = () => (
  <div className={styles.container}>
    <div className={styles.query}>
      <Query />
    </div>
    <div className={styles.content}>
      <Content />
    </div>
  </div>
);

// TODO: Here
export default withRouter(Page);
