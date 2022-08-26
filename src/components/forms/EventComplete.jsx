import "moment/locale/es-us";
import "../../styles/completeForm.css";
import React, { Component, Fragment } from "react";
import { Col, Form, FormGroup, Label, Input, FormFeedback } from "reactstrap";
import { translate } from "react-i18next";
import SpeakerAdder from "./SpeakerAdder";
import CardForm from "./CardForm";
import PropTypes from "prop-types";
import eventShape from "../props/Event";
import NumberInput from "./NumberInput";
import SpinnerButton from "../commons/SpinnerButton";

class EventComplete extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    event: eventShape.isRequired,
    submitting: PropTypes.bool,
    error: PropTypes.any,
  };

  static defaultProps = {
    submitting: false,
  };

  state = {
    formValidated: false,
    feedback: "",
    actualAssistants: "",
    done: true,
    notDone: false,
    speakers: [],
  };

  constructor(props) {
    super(props);

    const { event } = props;

    this.state = {
      feedback: event.feedback || "",
      actualAssistants: event.assistants.actual || "",
      speakers: event.speakers || [],
      formValidated: false,
      done: true,
      notDone: false,
    };
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleOnSubmit = (e) => {
    e.preventDefault();
    this.setState({ formValidated: true });

    if (e.target.checkValidity()) {
      const speakers = this.speakerAdder.handleAddSpeaker();
      if (speakers) {
        const submission = this.state;
        // this.setState({ speakers }) does not happen synchronously. Manually setting speakers.
        submission.speakers = speakers;
        this.props.onSubmit(submission);
      }
    }
  };

  handleOnBlur = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value.trim() });
  };

  handleOptionChange = (changeEvent) => {
    this.setState({
      done: changeEvent.target.value === "done",
      notDone: changeEvent.target.value === "notDone",
    });
  };

  updateSpeakers = (speakers) => {
    this.setState({ speakers });
  };

  errorText = (element, error) => {
    const { t } = this.props;
    return `${t(element)} ${t(error)}`;
  };

  getSpeakerAdder = (adder) => {
    if (adder) this.speakerAdder = adder.getWrappedInstance();
  };

  render() {
    const { t, event, submitting } = this.props;
    const { done } = this.state;
    const isEditing = event.state === "completed";
    const boxLink = "http://ibm.biz/fotos-embajadores";

    return (
      <Fragment>
        <div className="form-title">
          {isEditing
            ? t("editEvent")
            : t("completeEventData", { name: event.name })}
        </div>
        <CardForm>
          <Form
            id="mainForm"
            onSubmit={this.handleOnSubmit}
            noValidate
            className={this.state.formValidated ? "was-validated" : ""}
          >
            <FormGroup row>
              {!isEditing && (
                <Col className="align-self-center">
                  <FormGroup check>
                    <Label check>
                      <Input
                        type="radio"
                        value="done"
                        name="done"
                        checked={this.state.done}
                        onChange={this.handleOptionChange}
                      />{" "}
                      {t("done")}
                    </Label>
                  </FormGroup>
                  <FormGroup check>
                    <Label check>
                      <Input
                        type="radio"
                        value="notDone"
                        name="notDone"
                        checked={this.state.notDone}
                        onChange={this.handleOptionChange}
                      />{" "}
                      {t("notDone")}
                    </Label>
                  </FormGroup>
                </Col>
              )}
              <Col className="align-self-center">
                {isEditing && (
                  <Label for="actualAssistants">{t("actualAssistants")}</Label>
                )}
                <NumberInput
                  required={this.state.done}
                  value={this.state.actualAssistants}
                  onChange={this.handleInputChange}
                  disabled={this.state.notDone}
                  name="actualAssistants"
                  id="actualAssistants"
                  placeholder={!isEditing && t("actualAssistants")}
                />
                <FormFeedback>
                  {this.errorText("actualAssistants", "requiredPlural")}
                </FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col>
                <Label for="feedback">{t("eventCommentary")}</Label>
                <Input
                  required
                  value={this.state.feedback}
                  onChange={this.handleInputChange}
                  type="textarea"
                  rows="5"
                  name="feedback"
                  id="feedback"
                  onBlur={this.handleOnBlur}
                  placeholder={
                    done
                      ? t("eventCommentaryPlaceholder")
                      : t("eventNotDonePlaceholder")
                  }
                />
                <FormFeedback>
                  {this.errorText("eventCommentary", "required")}
                </FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col>
                <Label>
                  <div>
                    {t("addImages")}{" "}
                    <a className="am-link-blue" target="_blank" href={boxLink}>
                      {boxLink}
                    </a>
                  </div>
                  <div className="box-help">{t("boxHelp")}</div>
                </Label>
              </Col>
            </FormGroup>
          </Form>
          <SpeakerAdder
            ref={this.getSpeakerAdder}
            disable={this.state.notDone}
            speakers={this.state.speakers}
          />
          <SpinnerButton
            form="mainForm"
            type="submit"
            className="float-right"
            outline
            color="primary"
            submitting={submitting}
            message={isEditing ? t("submitEdit") : t("finish")}
          />
          <FormFeedback
            className={
              this.props.error ? "show float-right text-right" : "hide"
            }
          >
            {t("submitConnectionError")}
          </FormFeedback>
        </CardForm>
      </Fragment>
    );
  }
}

export default translate("forms")(EventComplete);
