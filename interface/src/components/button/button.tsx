import React from "react";

import styles from "./_button.module.scss";

type IButtonProps = {
  textColor: string;
  buttonColor: string;
  children: React.ReactNode;
};

const Button = React.memo<IButtonProps>(({ textColor, buttonColor, children }) => {
  return (
    <button className={styles.button} style={{ color: textColor, backgroundColor: buttonColor }}>
      {children}
    </button>
  );
});

export default Button;
