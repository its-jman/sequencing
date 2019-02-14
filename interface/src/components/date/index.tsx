import React, { PureComponent } from "react";

import styles from "./_date.module.scss";

type IDateProps = {
  date: string;
};

class DateComponent extends PureComponent<IDateProps & React.HTMLAttributes<HTMLSpanElement>> {
  render() {
    const { date: rawDate, ...rest } = this.props;
    const date = new Date(rawDate);

    return <span {...rest}>{date.toLocaleDateString()}</span>;
  }
}

export default DateComponent;
