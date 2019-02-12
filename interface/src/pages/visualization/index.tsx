import React from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";

import * as actions from "src/state/actions";
import { IAppState } from "src/state/models";

import Sidebar from "./components/sidebar";
import Analysis from "./components/analysis";

import style from "./_visualization.module.scss";

class Visualization extends React.PureComponent<{ state: IAppState; dispatch: Dispatch }> {
  componentDidMount() {
    const { dispatch } = this.props;

    dispatch(actions.fetchDatasets());
  }

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

export default connect(
  (state) => ({ state }),
  (dispatch) => ({ dispatch })
  // @ts-ignore
)(Visualization);
