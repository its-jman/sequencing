import "normalize.css";
import "src/styles/main.scss";

import React from "react";
import Helmet from "react-helmet";
import { RouteProps, Switch, Route, Redirect, withRouter } from "react-router-dom";

import V2 from "src/pages/v2";
import { connect } from "src/state/connect";
import { IAppProps } from "src/state/models";
import * as actions from "src/state/actions";

class App extends React.PureComponent<IAppProps> {
  static routes: Array<RouteProps> = [
    {
      path: "/v2",
      component: V2
    },
    {
      // Match all non-handled routes
      path: "/",
      render: (props) => <Redirect {...props} to="/v2" />
    }
  ];

  componentDidMount() {
    this.props.dispatch(actions.fetchDatasets());
  }

  render() {
    const { state } = this.props;

    return (
      <>
        <Helmet>
          <title>{state.ui.title ? `${state.ui.title} | sequencing` : "sequencing"}</title>
        </Helmet>
        <Switch>
          {App.routes.map((route, i) => (
            <Route key={i} {...route} />
          ))}
        </Switch>
      </>
    );
  }
}

// @ts-ignore
export default withRouter(connect(App));
