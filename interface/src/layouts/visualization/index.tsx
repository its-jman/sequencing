import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { IAppState } from "src/state";
import * as a from "src/state/actions";
import DatasetList from "src/layouts/visualization/components/datasetList";
import Analysis from "src/layouts/visualization/components/analysis";

interface IVisualizationProps {
  state: IAppState;
  actions: {};
}

class Visualization extends React.Component<IVisualizationProps> {
  componentDidMount() {}

  render() {
    const { state, actions } = this.props;
    return (
      <div className="visualization">
        <DatasetList />
        <Analysis />
      </div>
    );
  }
}

export default connect(
  (state: IAppState) => ({ state }),
  (dispatch) => ({ actions: bindActionCreators(a, dispatch) })
)(Visualization);
