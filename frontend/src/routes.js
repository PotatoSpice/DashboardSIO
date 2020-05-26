import React from "react";

import { BrowserRouter, Route, Switch } from "react-router-dom";
import dasboard from "./page/dasboard/index";
export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={dasboard} />
      </Switch>
    </BrowserRouter>
  );
}
