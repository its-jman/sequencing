import React from "react";
import { FiTrash2, FiPieChart, FiBarChart2 } from "react-icons/fi";

import * as actions from "src/state/actions";
import { IDataset, IDispatchProps } from "src/state/models";
import { connectDispatch } from "src/state/connect";

import { IconButton } from "src/components";
import Checkbox from "src/components/checkbox";

import styles from "./_sidebar.module.scss";

class ListItem extends React.PureComponent<{ dataset: IDataset } & IDispatchProps> {
  render() {
    const { dataset, dispatch } = this.props;

    return (
      <li className={styles.listItem}>
        <Checkbox size={18} />
        <IconButton
          Icon={FiTrash2}
          onClick={() => dispatch(actions.deleteDataset({ _id: dataset._id }))}
        />
        <IconButton Icon={FiPieChart} />
        <IconButton Icon={FiBarChart2} />
      </li>
    );
  }
}

// @ts-ignore
export default connectDispatch<{ dataset: IDataset }>(ListItem);
