import React from "react";

import { IAppProps, connect } from "src/state/connect";
import DatasetList from "src/layouts/visualization/components/datasetList";
import Analysis from "src/layouts/visualization/components/analysis";

class Visualization extends React.Component<IAppProps> {
  componentDidMount() {
    const { actions, dispatch } = this.props;

    dispatch(actions.fetchDatasets.create({}));
  }

  render() {
    const { state } = this.props;

    return (
      <div className="visualization">
        <DatasetList datasets={state.datasets} />
        <Analysis />
      </div>
    );
  }
}

export default connect(Visualization);
