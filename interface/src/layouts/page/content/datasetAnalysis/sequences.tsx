import React, { PureComponent } from "react";

import { IDataset, IDispatchProps } from "src/state/models";

import styles from "./_analysis.module.scss";
import { connect } from "react-redux";
import { actions } from "src/state/actions";

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
