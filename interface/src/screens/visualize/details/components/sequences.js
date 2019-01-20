import React from "react";
import { connect } from "react-redux";
import Collapsible from "react-collapsible";

import * as a from "../../../../state/actions/index";
import * as u from "../../../../state/utils";

class Sequences extends React.Component {
  _loadData = () => {
    const { datasetID, loadSequences, loadMatches, rawPattern } = this.props;
    loadSequences({ datasetID });
    if (rawPattern !== "") {
      loadMatches({ rawPattern, datasetID });
    }
  };

  render() {
    return (
      <Collapsible trigger="Sequences..." classParentString="sequences" onOpen={this._loadData} myData={this.props.selection}>
        {this.props.selection.toString()}
      </Collapsible>
    );
  }
}

class SequencesContainer extends React.Component {
  state = {
    rawPattern: "",
    sequences: {},
    matches: {}
  };

  _loadAsyncData = (datasetID) => {
    /*dispatch(loadStuff());
    return api.datasets.getSequences({ datasetID });*/
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.id !== this.props.id) {
      this.setState({ externalData: null });
      this._loadAsyncData(nextProps.id);
    }
  }

  render() {
    const { sequences, matches } = this.state;

    return <Sequences sequenceList={sequences} matches={matches} />;
  }
}

export default connect(
  (state, ownProps) => {
    return {
      selection: u.getSelection(state),
      rawPattern: state.query.data.rawPattern
    };
  },
  (dispatch, ownProps) => {
    return {
      loadSequences: ({ datasetID }) => dispatch(a.loadDatasetSequences(datasetID)),
      loadMatches: ({ rawPattern, datasetID }) =>
        dispatch(a.loadQueryMatches({ rawPattern, datasetID }))
    };
  }
)(Sequences);
