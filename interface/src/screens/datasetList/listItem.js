import React from "react";
import { Link } from "react-router-dom";

import Checkbox from "../../components/checkbox";
import connect from "react-redux/es/connect/connect";
import * as a from "../../state/actions";

/**
 * DatasetError
 * @typedef {Object} DatasetError
 * @property {Array} records
 * @property {Array} upload_meta
 */

/**
 * @typedef {Object} RecordsMeta
 * @property {Object} alphabet
 * @property {number} amino_acid_count
 * @property {number} record_count
 * @property {number} ignored_count
 */

/**
 * @typedef {Object} UploadMeta
 * @property {string} name
 * @property {string} upload_time
 * @property {string} user_filename
 */

/**
 * DatasetItem
 * @typedef {Object} Dataset
 * @property {DatasetError} errors
 * @property {string} id
 * @property {RecordsMeta} records_meta
 * @property {UploadMeta} upload_meta
 */

class DatasetListItem extends React.Component {
  render() {
    /**
     * @type {Dataset}
     */
    const { dataset, _deleteDataset } = this.props;

    return (
      <tr>
        <td>
          <Checkbox />
        </td>
        <td>
          <Link to={`/datasets/${dataset.id}`}>{dataset.upload_meta.name}</Link>
        </td>
        <td>{dataset.upload_meta.user_filename}</td>
        <td>{new Date(dataset.upload_meta.upload_time).toString()}</td>
        <td>{dataset.records_meta.length}</td>
        <td>
          <button className="mdi-btn mdi mdi-delete mdi-24px" onClick={() => _deleteDataset} />
        </td>
      </tr>
    );
  }
}

export default connect(
  (state, ownProps) => {
    return {};
  },
  (dispatch, ownProps) => {
    return {
      _deleteDataset: () => dispatch(a.deleteDataset())
    };
  }
)(DatasetListItem);
