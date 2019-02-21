import React from "react";

import styles from "./_v2.module.scss";

import Query from "./query";
import Content from "./content";

export default () => (
  <div className={styles.container}>
    <div className={styles.query}>
      <Query />
    </div>
    <div className={styles.content}>
      <Content />
    </div>
  </div>
);
