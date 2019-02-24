import React, { PureComponent } from "react";

import { IDataset, IDispatchProps } from "src/state/models";
import { actions } from "src/state/actions";

import styles from "./_analysis.module.scss";
import { connect } from "react-redux";

type ISequencesProps = {
  dataset: IDataset;
} & IDispatchProps;

class Sequences extends PureComponent<ISequencesProps> {
  constructor(props: ISequencesProps) {
    super(props);
    props.dispatch(actions.fetchSequences({ id: props.dataset._id, page: 1 }));
  }

  render() {
    return <div>{}</div>;
  }
}

export default connect(
  () => ({}),
  (dispatch) => ({ dispatch })
)(Sequences);
