import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Container, Row, Col, Card, CardBody, Button } from "reactstrap";
import moment from "moment";
import { translate, Interpolate } from "react-i18next";
import eventShape from "../props/Event";
import modalToggler from "../hocs/modalToggler";
import Email from "../commons/Email";
import ReviewModal from "./ReviewModal";
import SpeakerList from "./SpeakerList";
import NotificationHistory from "./NotificationHistory";
import TooltipButton from "../commons/TooltipButton";
import Assistants from "../commons/Assistants";
import Capitalize from "../commons/Capitalize";
import BackLink from "../commons/BackLink";
import BackableLink from "../commons/BackableLink";

class EventPage extends Component {
  static propTypes = {
    event: eventShape.isRequired,
    fromLink: PropTypes.string.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    isOwner: PropTypes.bool.isRequired,
    handleApprove: PropTypes.func.isRequired,
    handleReject: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
  };

  goToMail = () => {
    const { t, event } = this.props;
    window.location.href = `mailto:${event.owner.email}?Subject=${t(
      "joinEvent",
      { eventName: event.name }
    )}`;
  };

  render() {
    const {
      t,
      event,
      fromLink,
      isAdmin,
      isOwner,
      handleApprove,
      handleReject,
      handleDelete,
    } = this.props;

    const { notifications } = event;
    const revisions = notifications.filter(
      (notification) => notification.tag === "revision"
    );

    const goBackLink = `/events/?show=${fromLink}`;
    const editLink =
      event.state === "completed"
        ? `/event/complete/${event.id}`
        : `/edit/${event.id}`;
    const completeLink = `/event/complete/${event.id}`;

    const ApproveButton = modalToggler(Button, ReviewModal);
    const RejectButton = modalToggler(Button, ReviewModal);
    const DeleteButton = modalToggler("a", ReviewModal);

    const date = moment(event.date);
    const now = moment();
    const hasFinished = now.diff(date) > 0;

    const approveButtonProps = { color: "success" };

    const approveModalProps = {
      event,
      buttonType: "success",
      buttonMessage: t("approve"),
      onSubmit: handleApprove,
      label: t("message"),
    };

    const rejectButtonProps = { color: "secondary" };

    const rejectModalProps = {
      event,
      buttonType: "secondary",
      buttonMessage: t("revise"),
      onSubmit: handleReject,
      label: t("message"),
    };

    const deleteButtonProps = {
      color: "link",
      className: "am-link delete-link",
    };

    const deleteLabel = (
      <Fragment>
        <Interpolate i18nKey="deleteConfirm" eventName={<b>{event.name}</b>} />
        <br />
        {t("cannotRevert")}
      </Fragment>
    );

    const deleteModalProps = {
      event,
      buttonType: "danger",
      buttonMessage: t("delete"),
      onSubmit: handleDelete,
      label: deleteLabel,
      placeholder: t("reasonDelete"),
    };

    const joinButtonProps = {
      color: "primary",
      outline: true,
      onClick: this.goToMail,
    };

    const isScheduled = event.state === "scheduled";
    const isCompleted = event.state === "completed";
    const isApproved = event.state === "approved";
    const isCancelled = event.state === "cancelled";

    return (
      <Container>
        <Row>
          <Col>
            <div className="back-link">
              <BackLink to={goBackLink}>{t("back")}</BackLink>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md="8" sm="12" xs="12">
            <div className="event-title bold">{event.name}</div>
            <Row className="event-owner">
              <Col className="align-self-center" xs="auto">
                <a
                  className="flex"
                  target="_blank"
                  href={`https://w3.ibm.com/bluepages/profile.html?uid=${event.owner.uid}`}
                >
                  <img
                    alt=""
                    className="profile-picture"
                    src={`https://w3-services1.w3-969.ibm.com/myw3/unified-profile-photo/v1/image/${event.owner.uid}?def=null`}
                    crossOrigin="anonymous"
                  />
                </a>
              </Col>
              <Col xs="auto" className="align-self-center no-gutters">
                <div>
                  <a
                    target="_blank"
                    className="am-link"
                    href={`https://w3.ibm.com/bluepages/profile.html?uid=${event.owner.uid}`}
                  >
                    <Capitalize content={event.owner.fullName} />
                  </a>
                </div>
                <div>
                  <Email
                    email={event.owner.email}
                    subject={t("joinEvent", { eventName: event.name })}
                  />
                </div>
              </Col>
              {!isOwner && isApproved && !hasFinished && (
                <Col xs="auto" className="align-self-center">
                  <TooltipButton
                    tooltipMessage={t("contactToParticipate")}
                    buttonProps={joinButtonProps}
                  >
                    {t("wantToJoin")}
                  </TooltipButton>
                </Col>
              )}
            </Row>

            {event.speakers.length > 0 && (
              <Row className="event-ambassadors">
                <Col sm="12">
                  <div className="collabs-title bold">
                    {" "}
                    {t("collaborators")}{" "}
                  </div>
                </Col>
                <Col sm="12">
                  <SpeakerList items={event.speakers} eventName={event.name} />
                </Col>
              </Row>
            )}

            {isOwner && isScheduled && revisions.length > 0 && !isAdmin && (
              <NotificationHistory notifications={revisions} />
            )}

            {isAdmin && notifications.length > 0 && (
              <Fragment>
                <div className="details-title bold">{t("notifications")}</div>
                <NotificationHistory notifications={notifications} />
              </Fragment>
            )}

            <div className="details-title bold">{t("details")}</div>
            <div className="details">{event.description}</div>

            {isCompleted && (
              <Fragment>
                <div className="details-title bold">
                  {t("ambassadorComment")}
                </div>
                <div className="details font-italic">{event.feedback}</div>
              </Fragment>
            )}
          </Col>
          <Col md="4" sm="12" xs="12">
            <Row>
              <Col>
                {isScheduled && (
                  <div className="alert alert-warning">{t("inRevision")}</div>
                )}
                {isCompleted && (
                  <div className="alert alert-success">{t("completed")}</div>
                )}
              </Col>
            </Row>
            {isAdmin && isScheduled && (
              <Row className="approval-buttons justify-content-center">
                <Col xs="auto">
                  <ApproveButton
                    togglerProps={approveButtonProps}
                    modalProps={approveModalProps}
                  >
                    {t("approve")}
                  </ApproveButton>
                </Col>
                <Col xs="auto">
                  <RejectButton
                    togglerProps={rejectButtonProps}
                    modalProps={rejectModalProps}
                  >
                    {t("revise")}
                  </RejectButton>
                </Col>
              </Row>
            )}
            {(isOwner || isAdmin) && !isCompleted && hasFinished && isApproved && (
              <Row className="approval-buttons justify-content-end">
                <Col xs="auto">
                  <BackableLink to={completeLink}>
                    <Button color="success">{t("completeData")}</Button>
                  </BackableLink>
                </Col>
              </Row>
            )}
            <Row>
              <Col>
                <Card className="event-info-card">
                  <CardBody>
                    <Row className="info-row">
                      <Col xs="auto">
                        <span className="lnr lnr-clock"></span>
                      </Col>
                      <Col>
                        {t("fullDate", {
                          day: date.format("D"),
                          month: date.format("MMMM"),
                          year: date.format("YYYY"),
                          time: date.format("LT"),
                        })}
                      </Col>
                    </Row>
                    <Row className="info-row">
                      <Col xs="auto">
                        <span className="lnr lnr-map-marker"></span>
                      </Col>
                      <Col>
                        <div className="bold">{event.location.institution}</div>
                        {/*  <div>{event.location.address}</div> */}
                      </Col>
                    </Row>
                    <Row className="info-row">
                      <Col xs="auto">
                        <span className="lnr lnr-users"></span>
                      </Col>
                      <Col>
                        <div className="bold">
                          <Assistants
                            expectedAssistants={event.assistants.expected}
                            finalAssistants={event.assistants.actual}
                          />
                        </div>
                      </Col>
                    </Row>
                    <Row className="info-row">
                      <Col xs="auto">
                        <span className="lnr lnr-tag"></span>
                      </Col>
                      <Col>
                        <div className="bold">{t("category")}</div>
                        <div>{event.category}</div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            {(isOwner || isAdmin) && !isCancelled && (
              <Row className="edit-button-row justify-content-center">
                <Col sm="12" className="edit-button text-right">
                  <BackableLink className="am-link" to={editLink}>
                    <span className="lnr lnr-pencil"></span> {t("editEvent")}
                  </BackableLink>
                </Col>
                <Col sm="12" className="text-right">
                  <DeleteButton
                    togglerProps={deleteButtonProps}
                    modalProps={deleteModalProps}
                  >
                    <span className="lnr lnr-trash"></span> {t("deleteEvent")}
                  </DeleteButton>
                </Col>
              </Row>
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default translate()(EventPage);
