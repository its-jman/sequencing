import React from "react";

import Sidebar from "./sidebar";
import Content from "./content";

import styles from "./_layout.module.scss";

export const Layout = () => (
  <div className={styles.container}>
    <Sidebar />
    <Content />
  </div>
);
