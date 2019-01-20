import React from "react";
import { connect } from "react-redux";

import { urls } from "../../../../api";
import { setActive } from "../../../../state/actions";
import Checkbox from "../../../../components/checkbox";

class DatasetListItem extends React.PureComponent {
  _onClick = () => {
    const { dataset, setActive } = this.props;
    setActive(dataset.id);
  };

  _getMatches = () => {
    const { queryMatch } = this.props;
    if (queryMatch !== undefined) {
      return (
        <div>
          Matches: {queryMatch.record_count}; Ignored M's: {queryMatch.ignored_count}
        </div>
      );
    }

    return null;
  };

  render() {
    const { dataset, active } = this.props;

    const classNames = ["dataset-list-item"];
    if (active) {
      classNames.push("dataset-list-item-active");
    }

    return (
      <li className={classNames.join(" ")} onClick={this._onClick}>
        <Checkbox id={`dataset-${dataset.id}`} />
        <a href={urls.datasets.get(dataset.id)}>{dataset.upload_meta.name}</a>
        <br />
        Records: {dataset.records_meta.record_count}; Ignored: {dataset.records_meta.ignored_count}
        {this._getMatches()}
      </li>
    );
  }
}

export default connect(
  (state, ownProps) => {
    return {
      queryMatch: state.query.data.items[ownProps.dataset.id],
      active: state.selection.active === ownProps.dataset.id
    };
  },
  (dispatch, ownProps) => {
    return {
      setActive: (id) => {
        dispatch(setActive(id));
      }
    };
  }
)(DatasetListItem);
