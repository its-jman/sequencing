import React from "react";

import api from "../../api";

class Dataset extends React.Component {
  state = {
    data: {},
    error: {},
    success: false
  };

  componentDidMount() {
    const { dataset_id } = this.props.match.params;

    api.datasets
      .get(dataset_id)
      .then((response) => {
        this.setState({
          data: response.data,
          error: response.data.error,
          success: true
        });
      })
      .catch((err) => {
        this.setState({
          data: {},
          error: err.error,
          success: false
        });
      });
  }

  _sendDeleteDataset = () => {
    const { dataset_id } = this.props.match.params;

    api.datasets.delete(dataset_id);
  };

  render() {
    const { data, success } = this.state;

    if (!success) {
      return null;
    }

    return (
      <React.Fragment>
        <div className="upload-meta">
          <p>{data.upload_meta.name}</p>
          <p>{data.upload_meta.user_filename}</p>
          <p>{new Date(data.upload_meta.upload_time).toString()}</p>
          <button className="mdi-btn mdi mdi-delete mdi-24px" onClick={this._sendDeleteDataset} />
        </div>
        <div className="dataset-details">
          <p>Number of Records: {data.records_meta.record_count}</p>
          <p>Number of Ignored Records: {data.records_meta.ignored_count}</p>
          <p>Amino Acid Count: {data.records_meta.amino_acid_count}</p>

          <ul>
            {Object.keys(data.records_meta.alphabet).map((k) => {
              const val = data.records_meta.alphabet[k];
              const percentage = val / data.records_meta.amino_acid_count;
              return (
                <li key={k} style={{ padding: "2px" }}>
                  {k}: {(percentage * 100).toFixed(3)}%
                </li>
              );
            })}
          </ul>
        </div>
        {/*<ul className="dataset-records">
          <li>
            {record.seq_id}
            <br />
            {record.sequence.alphabet}
          </li>
        </ul>*/}
      </React.Fragment>
    );
  }
}

export default Dataset;
