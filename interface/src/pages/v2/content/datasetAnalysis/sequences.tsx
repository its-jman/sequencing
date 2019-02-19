import React, { PureComponent } from "react";
import { Dispatch } from "redux";

import styles from "./_analysis.module.scss";

import { IDataset } from "src/state/models";
import { isEmptyObject } from "src/utils";
import { connectDispatch } from "src/state/connect";
import * as actions from "src/state/actions";

type ISequencesProps = {
  dataset: IDataset;
  dispatch: Dispatch;
};

class Sequences extends PureComponent<ISequencesProps> {
  constructor(props: ISequencesProps) {
    super(props);
    props.dispatch(actions.fetchSequences({ _id: props.dataset._id }));
  }

  render() {
    return <div>{}</div>;
  }
}

// @ts-ignore
export default connectDispatch(Sequences);
