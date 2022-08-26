import React, { Component, Fragment } from "react";
//import { translate } from "react-i18next";
import { Button, Container, Row, Col } from "reactstrap";
import authService from "../services/authService";
import BackableLink from "./commons/BackableLink";
import Footer from "./Footer";
import ChampionsBanner from "./champions/ChampionsBanner";
import SubscriptionToEvent from "./subscriptions/SubscriptionToEvent";

class Home extends Component {
  state = { collapse: false };

  toggle = (e) => {
    this.setState(({ isOpen }) => ({ isOpen: !isOpen }));
  };

  isSubscriber() {
    return authService.getUser().isSubscriber;
  }

  render() {
    const isSubscriber = this.isSubscriber();

    return (
      <div>
        <div className="banner">
          <h1 className="banner-title">
            ¡Enterate de todo lo que estamos haciendo!
          </h1>
        </div>
        <Container className="home">
          <Row>
            <Col className="home-content">
              <h2 className="section-title">
                ¿Qué es el Programa de Embajadores?
              </h2>
              <div className="home-text1">
                Una iniciativa para impulsar la marca y el posicionamiento de
                IBM tanto interna como externamente en el mercado local.
                <br />
                <span className="home-subtitle">
                  ¿Cuáles son los objetivos?
                </span>
                <ul className="objectives">
                  <p>
                    Generar oportunidades para posicionar nuestras soluciones,
                    compartir y amplificar el mensaje a través de nuestros
                    voceros y desarrollar el ecosistema.
                  </p>
                </ul>
              </div>
              <Row className="events">
                {isSubscriber ? (
                  <BackableLink className="nav-link " to="/create">
                    <Button className="blue-btn">Creá tu evento</Button>
                  </BackableLink>
                ) : (
                  <Fragment>
                    <BackableLink className="nav-link ">
                      <Button onClick={this.toggle} className="blue-btn">
                        Creá tu evento
                      </Button>
                    </BackableLink>
                    <SubscriptionToEvent
                      toggle={this.toggle}
                      isOpen={this.state.isOpen}
                    />
                  </Fragment>
                )}
                <BackableLink className="no-padding" to="/events">
                  <Button className="blue-btn">
                    ¡Mirá los próximos eventos!
                  </Button>
                </BackableLink>
              </Row>
            </Col>
            <Col className="col-center ambassadors-program">
              <img
                src="/img/people.png"
                alt="people"
                className="people"
                width="240px"
              />
            </Col>
          </Row>

          <Row>
            <Col className="col-center padding-bottom">
              <h2 className="section-title">Ambassador Champions</h2>
              <p className="home-text">
                ¿Quiénes son? Embajadores referentes que podrán guiarte en tu
                camino como embajador.
              </p>
              <ChampionsBanner />
              <img
                src="/img/champions.png"
                alt="champions"
                className="champions"
                width="240px"
              />
            </Col>
            <Col className="col-center padding-bottom">
              <h2 className="section-title">Comunidades amigas</h2>
              <div className="communities">
                <a
                  className="comm-link"
                  rel="noopener noreferrer"
                  href="https://www.ibm.org/"
                  target="_blank"
                >
                  <div className="community volunteers">
                    <span>IBM.org</span>
                  </div>
                </a>
                <a
                  className="comm-link"
                  rel="noopener noreferrer"
                  href="https://yourlearning.ibm.com/"
                  target="_blank"
                >
                  <div className="community think40">
                    <span>Your Learning</span>
                  </div>
                </a>
                <a
                  className="comm-link"
                  rel="noopener noreferrer"
                  href="https://startupwithibm.mybluemix.net/"
                  target="_blank"
                >
                  <div className="community startup">
                    <span>Startup with IBM</span>
                  </div>
                </a>
                <a
                  className="comm-link"
                  rel="noopener noreferrer"
                  href="https://my15.digitalexperience.ibm.com/b73a5759-c6a6-4033-ab6b-d9d4f9a6d65b/dxsites/151914d1-03d2-48fe-97d9-d21166848e65/home"
                  target="_blank"
                >
                  <div className="community academic">
                    <span>Iniciativa Académica</span>
                  </div>
                </a>
                <a
                  className="comm-link"
                  rel="noopener noreferrer"
                  href="https://ibmuniversity.mybluemix.net/"
                  target="_blank"
                >
                  <div className="community university">
                    <span>IBM University</span>
                  </div>
                </a>
                <a
                  className="comm-link"
                  rel="noopener noreferrer"
                  href="https://w3.ibm.com/w3publisher/academic-ambassadors"
                  target="_blank"
                >
                  <div className="community news">
                    <span>Academic Ambassadors</span>
                  </div>
                </a>
              </div>
            </Col>
          </Row>
          <Footer />
        </Container>
      </div>
    );
  }
}

export default Home;
