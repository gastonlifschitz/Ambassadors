import React, { Component, Fragment } from "react";
import authService from "../../services/authService";
import api from "../../services/apiService";
import SpinnerButton from "../commons/SpinnerButton";
import { Container, Button } from "reactstrap";
import BackableLink from "../commons/BackableLink";

export default class EmailUnsuscription extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: authService.getUser().uid,
      motive: "Baja solicitada por el Embajador",
    };
  }

  isSubscriber() {
    return authService.getUser().isSubscriber;
  }

  handleOnSubmit = async () => {
    const unsub = {
      motive: this.state.motive,
      id: this.state.id,
    };
    try {
      await api.addUnsubscriber(unsub);
      this.forceUpdate();
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const isSubscriber = this.isSubscriber();

    return (
      <Fragment>
        {isSubscriber ? (
          <Container className="home">
            <h2 className="section-title">
              ¿Estás seguro de que querés abandonar la comunidad?
            </h2>
            <div>
              <SpinnerButton
                onClick={this.handleOnSubmit}
                className="teal-btn"
                message="Sí, quiero darme de baja"
              />
              <BackableLink className="no-padding" to="/">
                <Button className="btn-cancel ">
                  No, quiero seguir suscripto
                </Button>
              </BackableLink>
            </div>
          </Container>
        ) : (
          <Container className="home">
            <h2 className="section-title">
              Ya no sos parte de la comunidad de embajadores.
            </h2>
            <p>
              Podes volver a suscribirte cuando quieras desde nuestra página.
            </p>
          </Container>
        )}
      </Fragment>
    );
  }
}
