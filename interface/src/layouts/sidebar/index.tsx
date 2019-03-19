import React from "react";

import { Query } from "./query";
import { DescFilter } from "./descFilter";
import containerStyles from "../_layout.module.scss";

export default () => {
  return (
    <div className={containerStyles.sidebar}>
      <Query />
      <DescFilter />
    </div>
  );
};
