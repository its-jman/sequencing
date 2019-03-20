import "normalize.css";
import "src/styles/main.scss";

import React, { useContext } from "react";
import Helmet from "react-helmet";
import { observer } from "mobx-react-lite";
import { BrowserRouter as Router, Redirect, Route, RouteProps, Switch } from "react-router-dom";

import Manager from "src/components/manager";
import { UIContext } from "src/state/stores/ui";
import { Layout } from "src/layouts";

const routes: RouteProps[] = [
  {
    path: "/v2",
    component: Layout
  },
  {
    // Match all non-handled routes
    path: "/",
    render: (props) => <Redirect {...props} to="/v2" />
  }
];

const Head = observer(() => {
  const ui = useContext(UIContext);

  return (
    <Helmet>
      <title>{ui.title ? `${ui.title} | sequencing` : "sequencing"}</title>
    </Helmet>
  );
});

const Body = () => {
  return (
    <Switch>
      {routes.map((route, i) => (
        <Route key={i} {...route} />
      ))}
    </Switch>
  );
};

export const App = () => {
  return (
    <Router>
      <>
        <Head />

        <Manager />

        <Body />
      </>
    </Router>
  );
};
