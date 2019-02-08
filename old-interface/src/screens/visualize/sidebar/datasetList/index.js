import React from "react";

import DatasetListItem from "./listItem";
import connect from "react-redux/es/connect/connect";

class DatasetList extends React.PureComponent {
  render() {
    const { datasets } = this.props;

    return (
      <div className="dataset-list-container">
        <ul className="dataset-list">
          {Object.values(datasets).map((dataset) => {
            return <DatasetListItem key={dataset.id} dataset={dataset} />;
          })}
        </ul>
      </div>
    );
  }
}

export default connect(
  (state, ownProps) => {
    return {
      datasets: state.datasets.data.items
    };
  },
  (dispatch, ownProps) => {
    return {};
  }
)(DatasetList);
