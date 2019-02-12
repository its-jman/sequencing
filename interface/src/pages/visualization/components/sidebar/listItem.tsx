import React from "react";
import { FiTrash2 } from "react-icons/fi";

import * as actions from "src/state/actions";
import { IDataset, IDispatchProps } from "src/state/models";
import { connectDispatch } from "src/state/connect";

import { IconButton } from "src/components";

class ListItem extends React.PureComponent<{ dataset: IDataset } & IDispatchProps> {
  render() {
    const { dataset, dispatch } = this.props;

    return (
      <div className="dataset-item">
        <IconButton Icon={FiTrash2} onClick={() => dispatch(actions.deleteDataset(dataset._id))} />
      </div>
    );
  }
}

// @ts-ignore
export default connectDispatch<{ dataset: IDataset }>(ListItem);
