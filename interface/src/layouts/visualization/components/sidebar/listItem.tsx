import React from "react";
import { FiDelete } from "react-icons/fi";

import * as actions from "src/state/actions";
import { IDataset, IDispatchProps } from "src/state/models";
import { connectDispatch } from "src/state/connect";

class ListItem extends React.PureComponent<{ dataset: IDataset } & IDispatchProps> {
  render() {
    const { dataset, dispatch } = this.props;

    return (
      <div className="dataset-item">
        <button onClick={() => dispatch(actions.deleteDataset(dataset._id))}>
          <FiDelete />
        </button>
      </div>
    );
  }
}

// @ts-ignore
export default connectDispatch<{ dataset: IDataset }>(ListItem);
