import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { withCookies, Cookies } from "react-cookie";
import PropTypes from "prop-types";
import authService from "../services/authService";
import apiService from "../services/apiService";
import AppNavbar from "./AppNavbar";
import Home from "./Home";
import EventsContainer from "./eventsList/EventsContainer";
import EventFormContainer from "./forms/EventFormContainer";
import EventPageContainer from "./eventPage/EventPageContainer";
import EmailUnsuscription from "./unsubscriptions/EmailUnsubscribe";
import EventCompleteContainer from "./forms/EventCompleteContainer";
import ThankYou from "./ThankYou";
import FAQContainer from "./faq/FAQContainer";
import Ambassadors from "./admin/Ambassadors";
import NotFound from "./errors/NotFound";

const ScrollToTop = () => {
  return null;
};

class App extends Component {
  static propTypes = {
    cookies: PropTypes.instanceOf(Cookies).isRequired,
  };

  componentWillMount() {
    const { cookies } = this.props;
    cookies.set("Set-Cookie", "", { secure: "true" });
    authService.setToken(cookies.get("token"));
    apiService.setToken(authService.getToken());
  }

  render() {
    return (
      <div className="h-100">
        <Route component={ScrollToTop} />
        <Route path="/" component={AppNavbar} />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/events" component={EventsContainer} />
          <Route
            path="/event/complete/:id"
            component={EventCompleteContainer}
          />
          <Route exact path="/event/:id" component={EventPageContainer} />
          <Route path="/create" component={EventFormContainer} />
          <Route path="/edit/:id" component={EventFormContainer} />
          <Route path="/completed" component={ThankYou} />
          <Route path="/faq" component={FAQContainer} />
          <Route path="/unsubscribe" component={EmailUnsuscription} />
          <Route path="/admin" component={Ambassadors} />
          <Route component={NotFound} />
        </Switch>
      </div>
    );
  }
}

export default withCookies(App);
