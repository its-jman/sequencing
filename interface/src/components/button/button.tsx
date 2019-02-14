import React, { PureComponent } from "react";

import styles from "./_button.module.scss";

type IButtonProps = {
  textColor: string;
  buttonColor: string;
  children: React.ReactNode;
};

class Button extends PureComponent<IButtonProps> {
  render() {
    const { textColor, buttonColor, children } = this.props;
    return (
      <button className={styles.button} style={{ color: textColor, backgroundColor: buttonColor }}>
        {children}
      </button>
    );
  }
}

class SecondaryButton extends Button {
  render() {
    const { textColor, buttonColor, children } = this.props;
    return (
      <button
        className={styles.button}
        style={{ color: textColor, backgroundColor: "white", border: `1px solid ${buttonColor}` }}
      >
        {children}
      </button>
    );
  }
}

export default Button;
