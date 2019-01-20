import React from "react";
import { withRouter } from "react-router-dom";

import Title from "./title";

class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Title {...this.props} />
        <div className="content">{this.props.children}</div>
      </React.Fragment>
    );
  }
}

export default withRouter((props) => <App {...props} />);
