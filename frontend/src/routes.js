import React from "react";

import { BrowserRouter, Route, Switch } from "react-router-dom";
import Dasboard from "./page/dasboard/index";
export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Dasboard} />
      </Switch>
    </BrowserRouter>
  );
}
