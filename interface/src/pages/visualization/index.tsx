import React from "react";
import { connect } from "react-redux";

import { IAppProps } from "src/state/models";

import Sidebar from "./components/sidebar";
import Analysis from "./components/analysis";

import style from "./_visualization.module.scss";

class Visualization extends React.PureComponent<IAppProps> {
  render() {
    const { state } = this.props;

    return (
      <div className={style.content}>
        <Sidebar datasets={state.datasets} />
        <Analysis />
      </div>
    );
  }
}

export default Visualization;
