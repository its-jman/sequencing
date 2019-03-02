import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { FiChevronRight } from "react-icons/fi";

import { IAppState, IDataset, IDispatchProps, ISequence } from "src/state/models";
import { actions } from "src/state/actions";
import { isEmpty } from "src/utils";

import styles from "./_sequences.module.scss";
import { getClassNames } from "src/components/utils";

type ISequencesProps = {
  id: string;
  sequences: ISequence[];
};

class Sequences extends PureComponent<ISequencesProps & IDispatchProps> {
  state = {
    open: false
  };

  componentWillMount() {
    const { dispatch, id } = this.props;
    dispatch(actions.fetchSequences({ id: id, page: 1 }));
  }

  _toggleOpen = () => {
    this.setState({
      ...this.state,
      open: !this.state.open
    });
  };

  render() {
    const { sequences } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.header} onClick={this._toggleOpen}>
          <div className={styles.arrowContainer}>
            <span
              className={getClassNames(
                styles.arrowIcon,
                this.state.open ? styles.arrowIconOpen : undefined
              )}
            >
              &#x25B6;
            </span>
          </div>
          <span>Sequences</span>
        </div>
        <div
          className={getClassNames(
            styles.content,
            this.state.open ? styles.contentCollapsed : undefined
          )}
        >
          {!isEmpty(sequences) &&
            sequences.map((sequence) => (
              <div className={styles.sequence}>{sequence.description}</div>
            ))}
        </div>
      </div>
    );
  }
}

export default connect<{ sequences: ISequence[] }, IDispatchProps, { id: string }, IAppState>(
  (state) => ({
    sequences: []
  }),
  (dispatch) => ({ dispatch })
)(Sequences);
