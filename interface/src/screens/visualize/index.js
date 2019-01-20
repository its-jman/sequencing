import React from "react";
import { connect } from "react-redux";

import Sidebar from "./sidebar";
import Details from "./details";
import { loadDatasets } from "../../state/actions";

class Visualize extends React.Component {
  componentDidMount() {
    this.props._loadDatasets();
  }

  render() {
    return (
      <React.Fragment>
        <Sidebar />
        <Details />
      </React.Fragment>
    );
  }
}

export default connect(
  (state, ownProps) => {
    return {};
  },
  (dispatch, ownProps) => {
    return {
      _loadDatasets: () => dispatch(loadDatasets())
    };
  }
)(Visualize);
