import React from "react";

import { IDatasetsState } from "src/state/reducers";

class DatasetList extends React.Component<{ datasets: IDatasetsState }> {
  render() {
    return <div className="dataset-list" />;
  }
}

export default DatasetList;
