import React from "react";

import Query from "./query";
import Content from "./content";
import styles from "./_page.module.scss";

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

export default Page;
