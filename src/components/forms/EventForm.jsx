import "../../styles/form.css";
import "moment/locale/es-us";
import "react-datetime/css/react-datetime.css";
import Datetime from "react-datetime";
import React, { Component, Fragment } from "react";
import {
  Col,
  Form,
  FormGroup,
  FormFeedback,
  Label,
  Input,
  Row,
} from "reactstrap";
import classNames from "classnames";
import { translate } from "react-i18next";
import PropTypes from "prop-types";
import momentPropTypes from "react-moment-proptypes";
import moment from "moment";
import NumberInput from "./NumberInput";
import TimePicker from "./TimePicker";
import CardForm from "./CardForm";
import SpinnerButton from "../commons/SpinnerButton";

class EventForm extends Component {
  static propTypes = {
    error: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    categories: PropTypes.arrayOf(PropTypes.string).isRequired,
    submitting: PropTypes.bool,
    editting: PropTypes.bool,
    event: PropTypes.shape({
      eventName: PropTypes.string.isRequired,
      date: momentPropTypes.momentObj,
      time: PropTypes.shape({
        hour: PropTypes.number,
        minute: PropTypes.number,
      }).isRequired,
      assistants: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      institution: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
    }),
  };

  static defaultProps = {
    submitting: false,
    editting: false,
    event: {
      eventName: "",
      date: null,
      time: { hour: 7, minute: 0 },
      timeValue: "",
      assistants: "",
      institution: "",
      address: "------",
      description: "",
      category: "",
    },
  };

  constructor(props) {
    super(props);
    const { event } = props;
    event.category = event.categories || props.categories[0]; // Default category kit is the first one

    this.state = {
      formValidated: false,
      timeValue: event.time.hour
        ? `${this.pad(event.time.hour)}:${this.pad(event.time.minute)}`
        : "",
      ...event,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.event !== nextProps.event)
      this.setState({ ...nextProps.event });
  }

  /* retrieveOtherActivityKit(props) {
    const { event, activityKit } = props;

    if (!event.activityKit || activityKit.includes(event.activityKit))
      return "";

    return event.activityKit;
  } */

  pad(num) {
    return `0${num}`.slice(-2);
  }

  handleDateChange = (date) => {
    this.setState({ date });
  };

  handleTimeChange = (e) => {
    this.setState({
      time: e.target.time,
      timeValue: e.target.value,
    });
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleOnBlur = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value.trim() });
  };

  handleOnSubmit = (e) => {
    e.preventDefault();
    this.setState({ formValidated: true });
    if (e.target.checkValidity()) {
      const submission = {
        ...this.state,
      };

      this.props.onSubmit(submission);
    }
  };

  validDate(current) {
    return current.isAfter(moment());
  }

  errorText = (element, error) => {
    const { t } = this.props;
    return `${t(element)} ${t(error)}`;
  };

  render() {
    const { t, submitting, editting } = this.props;
    const submitText = editting ? "submitEdit" : "submitCreate";

    return (
      <Fragment>
        <div className="form-title">
          {editting ? t("editEvent") : t("createEvent")}
        </div>
        <CardForm>
          <Form
            onSubmit={this.handleOnSubmit}
            noValidate
            className={this.state.formValidated ? "was-validated" : ""}
          >
            <FormGroup row>
              <Col>
                <Label className="form-label" for="eventName">
                  {t("eventName")}
                  <span className="char-limit">(Máximo 34 caracteres)</span>
                </Label>
                <Input
                  maxlength="34"
                  required
                  value={this.state.eventName}
                  type="text"
                  name="eventName"
                  id="eventName"
                  onBlur={this.handleOnBlur}
                  onChange={this.handleInputChange}
                />
                <FormFeedback>
                  {this.errorText("eventName", "required")}
                </FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col xs="12">
                <Label className="form-label" for="institution">
                  {t("institution")}
                </Label>

                <Input
                  required
                  value={this.state.institution}
                  type="text"
                  name="institution"
                  id="institution"
                  onBlur={this.handleOnBlur}
                  onChange={this.handleInputChange}
                />

                <FormFeedback>
                  {this.errorText("institution", "requiredFem")}
                </FormFeedback>
              </Col>
            </FormGroup>

            <FormGroup row>
              <Col>
                <Label className="form-label" for="category">
                  {t("category")}
                </Label>
                <Input
                  name="category"
                  type="select"
                  value={this.state.category}
                  onChange={this.handleInputChange}
                >
                  {this.props.categories.map((ak) => (
                    <option key={ak} value={ak}>
                      {ak}
                    </option>
                  ))}
                </Input>
              </Col>
            </FormGroup>
            <FormGroup row></FormGroup>
            <FormGroup row>
              <Col>
                <Label className="form-label" for="date">
                  {t("date")}
                </Label>
                <Datetime
                  inputProps={{
                    placeholder: t("datePlaceholder"),
                    required: true,
                    className: "clickable form-control",
                  }}
                  value={this.state.date}
                  onChange={this.handleDateChange}
                  dateFormat="DD/MM/YYYY"
                  timeFormat={false}
                  closeOnSelect
                />
                <FormFeedback
                  className={classNames({
                    show: this.state.formValidated && !this.state.date,
                  })}
                >
                  {this.errorText("date", "requiredFem")}
                </FormFeedback>
              </Col>
              <Col>
                <Label className="form-label" for="time">
                  {t("time")}
                </Label>
                <TimePicker
                  required
                  step={30}
                  value={this.state.timeValue}
                  minTime="07:00"
                  onChange={this.handleTimeChange}
                />
              </Col>
              <Col>
                <Label className="form-label" for="assistants">
                  {t("assistants")}
                </Label>
                <NumberInput
                  required
                  value={this.state.assistants}
                  placeholder={t("aproximate")}
                  name="assistants"
                  id="assistants"
                  onChange={this.handleInputChange}
                />
                <FormFeedback>
                  {this.errorText("assistants", "requiredPlural")}
                </FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col>
                <Label className="form-label" for="description">
                  {t("description")}
                </Label>
                <Input
                  required
                  value={this.state.description}
                  placeholder={t("descriptionPlaceholder")}
                  type="textarea"
                  name="description"
                  id="description"
                  rows="5"
                  onBlur={this.handleOnBlur}
                  onChange={this.handleInputChange}
                />
                <FormFeedback>
                  {this.errorText("description", "requiredFem")}
                </FormFeedback>
              </Col>
            </FormGroup>

            <Row>
              <Col>
                <SpinnerButton
                  outline
                  className="float-right sub"
                  color="primary"
                  submitting={submitting}
                  message={t(submitText)}
                />
                <FormFeedback
                  className={classNames("float-right", "text-right", {
                    show: this.props.error,
                  })}
                >
                  {t("submitConnectionError")}
                </FormFeedback>
              </Col>
            </Row>
          </Form>
        </CardForm>
      </Fragment>
    );
  }
}

export default translate("forms")(EventForm);
