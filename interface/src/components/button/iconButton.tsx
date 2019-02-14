import React from "react";

import { IconType } from "react-icons/lib";

import styles from "./_iconButton.module.scss";
import { FiBarChart2 } from "react-icons/fi";
import { getClassNames } from "src/components/utils";

type IIconButtonProps = {
  className?: string;
  icon: IconType;
  size: number;
  onClick: () => void;
};

class IconButton extends React.PureComponent<IIconButtonProps> {
  static defaultProps = {
    size: 24,
    onClick: () => {}
  };

  render() {
    const { icon: Icon, size, onClick } = this.props;

    return (
      <div
        style={{ height: size, width: size }}
        className={getClassNames(styles.iconButton)}
        onClick={onClick}
      >
        <Icon size={size} />
      </div>
    );
  }
}

export default IconButton;
