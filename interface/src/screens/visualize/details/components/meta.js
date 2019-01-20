import React from "react";

class Meta extends React.Component {
  render() {
    const { dataset} = this.props;
    return (
      <div className="upload-meta">
        <p>{dataset.upload_meta.name}</p>
        <p>{dataset.upload_meta.user_filename}</p>
        <p>{new Date(dataset.upload_meta.upload_time).toString()}</p>
        <br />
        <p>Number of Records: {dataset.records_meta.record_count}</p>
        <p>Number of Ignored Records: {dataset.records_meta.ignored_count}</p>
        <p>Amino Acid Count: {dataset.records_meta.amino_acid_count}</p>
      </div>
    );
  }
}

export default Meta;
