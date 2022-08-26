import React, { Component } from "react";
import queryString from "query-string";
import { Link } from "react-router-dom";
import {
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  Collapse,
  Button,
} from "reactstrap";
import { translate } from "react-i18next";
import authService from "../services/authService";
import snackbarService from "../services/snackbarService";
import api from "../services/apiService";
import BackableLink from "./commons/BackableLink";
import SubscribeBanner from "./subscriptions/SubscribeBanner";

class AppNavbar extends Component {
  state = { collapse: false };

  toggle = () => {
    this.setState({ collapse: !this.state.collapse });
  };

  isSubscriber() {
    return authService.getUser().isSubscriber;
  }

  handleSubscribe = async (subscriber) => {
    try {
      await api.subscribe(subscriber);
      snackbarService.show("subscribed", 5000);
      this.forceUpdate();
    } catch (error) {
      snackbarService.show("subscribeError", 7000);
    }
  };

  render() {
    const { t, location } = this.props;
    // TODO: see if there is a better way to do this
    const atHome = location.pathname === "/";
    const atFAQ = location.pathname === "/faq";
    const { uid } = authService.getUser();
    const isSubscriber = this.isSubscriber();
    const showSubscribeOnMount = !!queryString.parse(location.search).subscribe;

    return (
      <Navbar color="faded" className="fixed-top" light expand="md">
        <Link to="/" className="navbar-brand">
          <span className="nav-title">IBM Embajadores Argentina</span>
        </Link>
        <NavbarToggler onClick={this.toggle} className="mr-2" />
        <Collapse isOpen={this.state.collapse} navbar>
          <Nav className="ml-auto" navbar>
            {isSubscriber ? (
              atFAQ ? (
                <NavItem>
                  <BackableLink className="no-padding" to="/events">
                    <Button className="blue-btn">
                      Mirá los próximos eventos
                    </Button>
                  </BackableLink>
                </NavItem>
              ) : atHome ? (
                <NavItem className="d-none d-md-flex">
                  <span className="profile-text">
                    ¡Ya sos parte de la comunidad!
                  </span>
                  <img
                    alt="profile"
                    className="profile-picture"
                    src={`https://w3-services1.w3-969.ibm.com/myw3/unified-profile-photo/v1/image/${uid}?def=null`}
                    crossOrigin="anonymous"
                  />
                </NavItem>
              ) : (
                <NavItem>
                  <BackableLink
                    className="nav-text-link nav-link am-link-blue faq-link"
                    to="/faq"
                  >
                    {t("faq")}
                  </BackableLink>
                </NavItem>
              )
            ) : !atFAQ ? (
              <NavItem>
                <BackableLink
                  className="nav-text-link nav-link am-link-blue faq-link"
                  to="/faq"
                >
                  {t("faq")}
                </BackableLink>
              </NavItem>
            ) : (
              <NavItem>
                <BackableLink className="no-padding" to="/events">
                  <Button className="blue-btn">
                    Mirá los próximos eventos
                  </Button>
                </BackableLink>
              </NavItem>
            )}
            {isSubscriber ? (
              <NavItem>
                <BackableLink className="nav-link no-padding" to="/create">
                  <Button className="blue-btn">{t("createEvent")}</Button>
                </BackableLink>
              </NavItem>
            ) : (
              <NavItem>
                <SubscribeBanner
                  submitting={this.state.submitting}
                  onSubscribe={this.handleSubscribe}
                  showOnMount={showSubscribeOnMount}
                />
              </NavItem>
            )}
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

export default translate()(AppNavbar);
