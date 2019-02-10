import React from "react";
import { connect, Provider } from "react-redux";
import Helmet from "react-helmet";

import { IAppState, store } from "src/state";
import { IContextState } from "src/state/reducers";

type IAppProps = {
  context: IContextState;
};

class App extends React.Component<IAppProps> {
  render() {
    const { context } = this.props;

    return (
      <>
        <Helmet>
          <title>{context.title ? `${context.title} | jman.me` : "jman.me"}</title>
        </Helmet>
        {"Hello World"}
      </>
    );
  }
}

export default connect((state: IAppState) => ({
  context: state.context
}))(App);
