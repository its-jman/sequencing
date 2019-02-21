import React from "react";

import styles from "./_v2.module.scss";

import ModalManager from "./components/modals/modalManager";
import Query from "./query";
import Content from "./content";

export default () => (
  <div className={styles.container}>
    <ModalManager />
    <div className={styles.query}>
      <Query />
    </div>
    <div className={styles.content}>
      <Content />
    </div>
  </div>
);
