import React from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";

import { IAppState, store } from "src/state";
import { IContextState } from "src/state/reducers";
import Visualization from "src/layouts/visualization";

type IAppProps = {
  context: IContextState;
};

class App extends React.Component<IAppProps> {
  render() {
    const { context } = this.props;

    return (
      <>
        <Helmet>
          <title>{context.title ? `${context.title} | sequencing` : "sequencing"}</title>
        </Helmet>
        <Visualization />
      </>
    );
  }
}

export default connect((state: IAppState) => ({
  context: state.context
}))(App);
