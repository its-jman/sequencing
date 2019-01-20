import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Redirect } from "react-router-dom";

import App from "./components/App";
import { store } from "./state/store";

import Dataset from "./screens/dataset";
import DatasetList from "./screens/datasetList";
import Visualize from "./screens/visualize";

import "./style.css";

ReactDOM.render(
  <BrowserRouter>
    <App>
      <Route exact path="/" render={() => <Redirect to="/visualize" />} />
      <Provider store={store}>
        <Route exact path="/visualize" component={Visualize} />
      </Provider>
      <Route exact path="/datasets" component={DatasetList} />
      <Route path="/datasets/:dataset_id" component={Dataset} />
    </App>
  </BrowserRouter>,
  document.getElementById("root")
);
