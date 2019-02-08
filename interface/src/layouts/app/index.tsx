import React from "react";
import { Provider } from "react-redux";
import Helmet from "react-helmet";

import { store } from "src/state";

export class App extends React.Component {
  render() {
    const { context, children } = this.props;

    return (
      <Provider store={store}>
        <Helmet>
          <title>{context.app.title}</title>
        </Helmet>
        {children}
      </Provider>
    );
  }
}
