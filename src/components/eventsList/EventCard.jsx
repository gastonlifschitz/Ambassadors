import "../../styles/indexCards.css";
import React from "react";
import { Row, Col, Card, CardBody, Button } from "reactstrap";
import { translate } from "react-i18next";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import moment from "moment";
import eventShape from "../props/Event";
import Capitalize from "../commons/Capitalize";
import BackableLink from "../commons/BackableLink";
import authService from "../../services/authService";

const truncateThreshold = 180;
const beginDay = moment().set({ hour: 0, minute: 0, second: 0 });

const EventCard = ({ t, item, fromLink }) => {
  const { uid, isAdmin } = authService.getUser();
  const isOwner = uid === item.owner.uid;
  const date = moment(item.date);
  const eventLink = `/event/${item.id}?from=${fromLink}`;
  const completeEventLink = `/event/complete/${item.id}`;
  const truncatedDescription =
    item.description.length > truncateThreshold
      ? `${item.description.substring(0, truncateThreshold)}...`
      : item.description;
  const needsCompletion =
    item.state === "approved" && moment(item.date) < beginDay.toDate();

  return (
    <Row className="card-row">
      <Card className="event-card">
        <CardBody>
          <Row>
            <Col md="auto" className="d-none d-md-block">
              <div className="mini-calendar">
                <div className="date-number">{date.format("D")}</div>
                <div className="date-month text-uppercase">
                  {date.format("MMM").replace(".", "")}
                </div>
              </div>
            </Col>
            <Col>
              <Row>
                <Col md="7" xs="12">
                  {needsCompletion && (isAdmin || isOwner) && (
                    <BackableLink to={completeEventLink}>
                      <Button
                        className="needs-completion-badge"
                        color="success"
                      >
                        {t("completeData")}
                      </Button>
                    </BackableLink>
                  )}

                  <div className="full-date light">
                    {t("fullDate", {
                      day: date.format("D"),
                      month: date.format("MMMM"),
                      year: date.format("YYYY"),
                      time: date.format("LT"),
                    })}
                  </div>
                  <Link to={eventLink}>
                    <div className="event-title">{item.name}</div>
                  </Link>
                  <div className="card-event-owner light">
                    <Capitalize content={item.owner.fullName} />
                  </div>
                </Col>
                <Col md="5" xs="12">
                  <Row>
                    <Col md="12" xs="6" className="location-item">
                      <Row className="no-gutters">
                        <Col xs="auto">
                          <span className="lnr lnr-map-marker card-icon"></span>
                        </Col>
                        <Col className="location-col">
                          <div className="bold">
                            {item.location.institution}
                          </div>
                        </Col>
                      </Row>
                    </Col>
                    <Col md="12" xs="6">
                      <Row className="no-gutters">
                        <Col xs="auto">
                          <span className="lnr lnr-users card-icon"></span>
                        </Col>
                        <Col className="assistants-col">
                          <div className="bold">
                            {!item.assistants.actual &&
                              item.assistants.expected}
                            {item.assistants.actual && item.assistants.actual}
                            {` ${t("assistants")}`}
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="event-description light text-justify">
                    {truncatedDescription}
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="justify-content-end">
            <Col xs="auto">
              <Link className="am-link-blue" to={eventLink}>
                {t("seeMore")}{" "}
              </Link>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Row>
  );
};

EventCard.propTypes = {
  item: eventShape.isRequired,
  fromLink: PropTypes.string.isRequired,
};

export default translate()(EventCard);
