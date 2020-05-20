import React from "react";

import { BrowserRouter, Route, Switch } from "react-router-dom";
import card from "./components/card";
export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={card} />
      </Switch>
    </BrowserRouter>
  );
}
