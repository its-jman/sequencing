import React from "react";
import { connect } from "react-redux";

import { SingleSelection } from "./selection";
import * as a from "../../../state/actions";
import * as u from "../../../state/utils";

class Details extends React.Component {
  render() {
    const { datasets, queryResult, selection, _deleteDataset } = this.props;

    let component;
    if (selection.length === 0) {
      component = null;
    } else if (selection.length === 1) {
      const datasetID = selection[0];
      component = (
        <SingleSelection
          dataset={datasets[datasetID]}
          match={queryResult[datasetID]}
          _deleteDataset={_deleteDataset}
        />
      );
    } else {
      component = null;
    }

    return <div className="details">{component}</div>;
  }
}

export default connect(
  (state, ownProps) => {
    const selection = u.getSelection(state);
    return {
      key: selection.join("-"),
      datasets: state.datasets.data.items,
      queryResult: state.query.data.items,
      selection: selection
    };
  },
  (dispatch, ownProps) => {
    return {
      _deleteDataset: (datasetID) => dispatch(a.deleteDataset(datasetID))
    };
  }
)(Details);
