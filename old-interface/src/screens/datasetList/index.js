import React from "react";

import api from "../../api";
import DatasetListItem from "./listItem";
import UploadModal from "../../components/uploadModal";

class DatasetList extends React.Component {
  state = {
    data: [],
    error: {}
  };

  componentDidMount() {
    api.datasets
      .get()
      .then((response) => {
        this.setState({
          data: response.data,
          error: response.data.error
        });
      })
      .catch((err) => {
        this.setState({
          data: {},
          error: err
        });
      });
  }

  render() {
    const { data } = this.state;

    return (
      <React.Fragment>
        <div className="table-header">
          <span className="header">Your Data</span>
          <UploadModal />
        </div>

        <table className="dataset-table">
          <thead>
            <tr>
              <th>Analyze?</th>
              <th>Dataset Name</th>
              <th>File Name</th>
              <th>Upload Time</th>
              <th>Number of Records</th>
            </tr>
          </thead>
          <tbody>{data.map((item) => <DatasetListItem key={item.id} dataset={item} />)}</tbody>
        </table>
      </React.Fragment>
    );
  }
}

export default DatasetList;
