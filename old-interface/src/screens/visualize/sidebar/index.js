import React from "react";
import { connect } from "react-redux";

import DatasetList from "./datasetList";
import Input from "../../../components/input";
import UploadModal from "../../../components/uploadModal";
import * as a from "../../../state/actions";

class Sidebar extends React.Component {
  render() {
    const { _submitQuery } = this.props;

    return (
      <div className="sidebar">
        <div className="sidebar-header">
          <UploadModal />
          <Input
            className="sidebar-header-search"
            type="text"
            placeholder="Search"
            autocapitalize={true}
            onSubmit={_submitQuery}
          />
        </div>
        <DatasetList />
      </div>
    );
  }
}

export default connect(
  (state, ownProps) => {
    return {};
  },
  (dispatch, ownProps) => {
    return {
      _submitQuery: (rawPattern) => dispatch(a.loadQuery(rawPattern))
    };
  }
)(Sidebar);
