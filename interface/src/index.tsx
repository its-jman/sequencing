import React from "react";
import * as mobx from "mobx";
import ReactDOM from "react-dom";
import MobxDevtools, { configureDevtool } from "mobx-react-devtools";

import { App } from "./app";

mobx.configure({ enforceActions: "always", computedRequiresReaction: true });

const discardedActionNames = ["limitedMap._removeOldest", "limitedMap.get", "limitedMap.set"];
mobx.spy((event) => {
  if (event.type === "action") {
    if (discardedActionNames.indexOf(event.name) === -1) {
      console.groupCollapsed(`%cRunning "${event.name}": `, "color: #3183c8");
      console.log("Args: ", event.arguments);
      console.log("Event: ", event);
      console.groupEnd();
    }
  }
});

// configureDevtool({
//   logFilter: (event) => {
//     if (event.type === "action") {
//       // console.log(`${event.name} with args: ${JSON.stringify(event.arguments)}`);
//       return true;
//     }
//     return false;
//   }
// });

ReactDOM.render(
  <>
    <MobxDevtools />
    <App />
  </>,
  document.getElementById("root")
);
