import React, { PureComponent } from "react";
import { Dispatch } from "redux";

import { IDataset, IDispatchProps } from "src/state/models";
import { connectDispatch } from "src/state/connect";
import { actions } from "src/state/actions";

import styles from "./_analysis.module.scss";

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

// @ts-ignore
export default connectDispatch(Sequences);
