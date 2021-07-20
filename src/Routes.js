import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import NewStock from "./containers/NewStock";
import RedirectTD from "./containers/RedirectTD";
import SelectAccountTD from "./containers/SelectAccountTD";
import Settings from "./containers/Settings";
import Checkout from "./containers/Checkout";
import InvalidTokenTD from "./containers/InvalidTokenTD";
import Stocks from "./containers/Stocks";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";

export default function Routes() {
  return (
    <Switch>
        <Route exact path="/">
            <Home />
        </Route>
        <UnauthenticatedRoute exact path="/login">
            <Login />
        </UnauthenticatedRoute>
        <UnauthenticatedRoute exact path="/signup">
            <Signup />
        </UnauthenticatedRoute>
        <AuthenticatedRoute exact path="/SelectAccountTD">
          <SelectAccountTD />
        </AuthenticatedRoute>
        <AuthenticatedRoute exact path="/newStock">
          <NewStock />
        </AuthenticatedRoute>
        <AuthenticatedRoute path="/redirectTD/">
          <RedirectTD />
        </AuthenticatedRoute>
        <AuthenticatedRoute exact path="/settings">
          <Settings />
        </AuthenticatedRoute>
        <AuthenticatedRoute exact path="/InvalidTokenTD">
          <InvalidTokenTD />
        </AuthenticatedRoute>
        <AuthenticatedRoute exact path="/stocks/:id">
          <Stocks />
        </AuthenticatedRoute>
        <AuthenticatedRoute exact path="/checkout/:id" component={Checkout}>
          <Checkout />
        </AuthenticatedRoute>
      {/* Finally, catch all unmatched routes */}
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}