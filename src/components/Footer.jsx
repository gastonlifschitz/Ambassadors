import React from "react";
import { translate } from "react-i18next";
import { Button, Container, Row, Col } from "reactstrap";
import authService from "../services/authService";
import { Link } from "react-router-dom";
//import UnsubscribeAmbassadors from "./unsubscriptions/UnsubscribeAmbassadors";

const Footer = ({ t }) => {
  const { isAdmin } = authService.getUser();

  return (
    <Container>
      <footer className="footer">
        <Row>
          <Col md="6" xs="12">
            <div className="ibm-text">
              <a
                target="_blank"
                rel="noreferrer noopener"
                className="footer-text"
                href="https://www.ibm.com/ar-es/legal?lnk=flg-tous-ares"
              >
                {" "}
                Términos y condiciones
              </a>
              <a
                target="_blank"
                rel="noreferrer noopener"
                className="footer-text"
                href="https://www.ibm.com/privacy/ar/es/?lnk=flg-priv-ares"
              >
                {" "}
                Privacidad
              </a>
              <Link to="/faq" className="footer-text">
                <span>Preguntas frecuentes</span>
              </Link>
            </div>
          </Col>
          {isAdmin ? (
            <Col md="6" xs="12">
              <a className="float-right" href="/data/events.csv" download>
                <Button className="download-btn blue-btn">
                  {t("downloadEvents")}
                </Button>
              </a>
              <a className="float-right" href="/data/subscribers.csv" download>
                <Button className="download-btn blue-btn">
                  {t("downloadSubscribers")}
                </Button>
              </a>
              {/* <UnsubscribeAmbassadors />  */}
            </Col>
          ) : (
            <Col md="6" xs="12">
              <div className="ibm-text ig-text">
                Powered by
                <a
                  target="_blank"
                  rel="noreferrer noopener"
                  className="ig-link"
                  href="https://innovationteam.mybluemix.net"
                >
                  {" "}
                  Innovation Team{" "}
                </a>
                {/* <span className="footer-text"> © IBM Argentina 2020</span> */}
              </div>
            </Col>
          )}
        </Row>
      </footer>
    </Container>
  );
};

export default translate()(Footer);
