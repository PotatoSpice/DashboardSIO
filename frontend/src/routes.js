import React from "react";

import { BrowserRouter, Route, Switch } from "react-router-dom";
import Dasboard from "./page/dasboard/index";
import Client from "./page/client/index";
import Saft from "./page/saft/index";

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Dasboard} />
        <Route path="/client" exact component={Client} />
        <Route path="/saft" exact component={Saft} />
      </Switch>
    </BrowserRouter>
  );
}
