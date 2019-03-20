import React from "react";
import { getClassNames } from "src/utils";

import styles from "./_arrowIcon.module.scss";

export const ArrowIcon = React.memo<{ open: boolean }>(({ open }) => {
  return (
    <div className={styles.arrowContainer}>
      <span className={getClassNames(styles.arrowIcon, open ? styles.arrowIconOpen : undefined)}>
        &#x25B6;
      </span>
    </div>
  );
});
