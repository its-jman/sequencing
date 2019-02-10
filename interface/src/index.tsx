import React from "react";
import ReactDOM from "react-dom";

import { default as App } from "src/layouts/app";
import { store } from "src/state";
import { Provider } from "react-redux";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
