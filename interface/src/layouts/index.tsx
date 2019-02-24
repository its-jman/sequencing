import "normalize.css";
import "src/styles/main.scss";

import React from "react";
import Helmet from "react-helmet";
import {
  RouteProps,
  Switch,
  Route,
  Redirect,
  withRouter,
  RouteComponentProps
} from "react-router-dom";

import { IAppState, IDispatchProps } from "src/state/models";
import { actions } from "src/state/actions";
import ModalManager from "src/components/modalManager";

import App from "./page";
import { connect } from "react-redux";

class LayoutHeaderRaw extends React.PureComponent<{ title: IAppState["ui"]["title"] }> {
  render() {
    const { title } = this.props;
    return (
      <Helmet>
        <title>{title ? `${title} | sequencing` : "sequencing"}</title>
      </Helmet>
    );
  }
}

const LayoutHeader = connect((state: IAppState) => ({
  title: state.ui.title
}))(LayoutHeaderRaw);

class LayoutRaw extends React.PureComponent<IDispatchProps & RouteComponentProps> {
  static routes: Array<RouteProps> = [
    {
      path: "/v2",
      component: App
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
    return (
      <>
        <ModalManager />
        <Switch>
          {LayoutRaw.routes.map((route, i) => (
            <Route key={i} {...route} />
          ))}
        </Switch>
      </>
    );
  }
}

const Layout = withRouter(
  connect(
    () => ({}),
    (dispatch) => ({ dispatch })
  )(LayoutRaw)
);

export default () => (
  <>
    <LayoutHeader />
    <Layout />
  </>
);
