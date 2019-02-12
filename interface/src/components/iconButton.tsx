import React from "react";

import { IconType } from "react-icons/lib";

import styles from "./_iconButton.module.scss";

type IIconButtonProps = {
  Icon: IconType;
  onClick: () => void;
};

class IconButton extends React.PureComponent<IIconButtonProps> {
  render() {
    const { Icon, onClick } = this.props;

    return (
      <div className={styles.iconButton} onClick={onClick}>
        <Icon size={24} />
      </div>
    );
  }
}

export default IconButton;
