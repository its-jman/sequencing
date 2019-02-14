import "normalize.css";
import "src/styles/main.scss";

import React from "react";
import { connect } from "src/state/connect";
import Helmet from "react-helmet";

import { Selection } from "src/pages";
import { IAppProps } from "src/state/models";
import * as actions from "src/state/actions";

class App extends React.PureComponent<IAppProps> {
  componentDidMount() {
    const { dispatch } = this.props;

    dispatch(actions.fetchDatasets());
  }

  render() {
    const { state } = this.props;

    return (
      <>
        <Helmet>
          <title>
            {state.context.title ? `${state.context.title} | sequencing` : "sequencing"}
          </title>
        </Helmet>
        <Selection {...this.props} />
      </>
    );
  }
}

export default connect(App);
