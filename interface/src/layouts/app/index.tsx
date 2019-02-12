import React from "react";
import { connect } from "src/state/connect";
import Helmet from "react-helmet";

import Visualization from "src/layouts/visualization";
import { IAppProps } from "src/state/models";

class App extends React.PureComponent<IAppProps> {
  render() {
    const { state } = this.props;

    return (
      <>
        <Helmet>
          <title>{state.context.title ? `${state.context.title} | sequencing` : "sequencing"}</title>
        </Helmet>
        <Visualization />
      </>
    );
  }
}

export default connect(App);
