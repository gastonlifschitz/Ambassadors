import "../../styles/formCard.css";
import React, { Component } from "react";
import { Row, Col, Container } from "reactstrap";
import moment from "moment";
import { translate } from "react-i18next";
import PageFillSpinner from "../spinners/PageFillSpinner";
import DocumentTitle from "react-document-title";
import EventForm from "./EventForm";
import api from "../../services/apiService";
import ErrorMessage from "../errors/ErrorMessage";
import ErrorHandler from "../errors/ErrorHandler";
import Footer from "../Footer";
import BackLink from "../commons/BackLink";
import authService from "../../services/authService";

class EventFormContainer extends Component {
  state = {
    submitting: false,
    editting: !!this.props.match.params.id,
    loading: !!this.props.match.params.id,
    event: null,
    error: null,
  };

  categories = [
    "Colegio Primario",
    "Colegio Secundario",
    "Universidad",
    "Sector Público",
    "ONG",
    "Cliente",
    "Interno",
    "Otro",
  ];

  isAdmin() {
    return authService.getUser().isAdmin;
  }

  async componentDidMount(props) {
    props = props || this.props;
    const shouldEdit = !!props.match.params.id;

    if (shouldEdit) {
      const { id } = props.match.params;
      try {
        const response = await api.getEvent(id);
        const event = response.data;
        this.setState({ event, loading: false });
      } catch (error) {
        this.setState({ error, loading: false });
      }
    }
  }

  // Check if the event ID of in the URL has been modified. Load event if that is the case
  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.id !== nextProps.match.params.id) {
      this.setState({
        loading: !!nextProps.match.params.id,
        editting: !!nextProps.match.params.id,
        event: null,
      });
      this.componentDidMount(nextProps);
    }
  }

  eventToForm(event) {
    const { assistants, location } = event;
    const date = moment(event.date);

    return {
      eventName: event.name,
      date,
      time: {
        hour: date.hour(),
        minute: date.minute(),
      },
      assistants: assistants.expected,
      institution: location.institution,
      description: event.description,
      category: event.category,
    };
  }

  formToEvent(form) {
    const { hour, minute } = form.time;
    const date = form.date.set({ hour, minute });

    return {
      name: form.eventName,
      date: date.toDate(),
      assistants: {
        expected: form.assistants,
      },
      location: {
        institution: form.institution,
        address: "------", //aca ESTÁN LAS LINEAS DE LA DIRECCIÓN
      },
      description: form.description,
      category: form.category,
    };
  }

  handleOnSubmit = async (submission) => {
    const edittedEvent = this.formToEvent(submission);
    let response = null;

    this.setState({ submitting: true, event: edittedEvent });

    try {
      if (this.state.editting)
        response = await api.editEvent(this.state.event.id, edittedEvent);
      else {
        response = await api.createEvent(edittedEvent);

        console.log("Es admin? " + this.isAdmin());

        if (this.isAdmin()) {
          console.log("Response " + response.data._id);
          await api.approveEvent(response.data._id, "Aprobado automáticamente");
        }
      }

      this.setState({ submitting: false });
      this.props.history.push(`/event/${response.data._id}?from=owned`); // Redirect to event details
    } catch (error) {
      this.setState({ error, submitting: false });
    }
  };

  render() {
    const { t, match, location } = this.props;
    const { editting } = this.state;
    const backLocation =
      (location.state && location.state.from) ||
      (editting && `/event/${match.params.id}?from=owned`) ||
      "/";

    if (this.state.loading) return <PageFillSpinner />;

    if (this.state.error && !this.state.event) {
      return (
        <ErrorHandler error={this.state.error}>
          <ErrorMessage
            title={t("notFoundEvent")}
            explanation={t("explanationNotFoundEvent")}
          />
        </ErrorHandler>
      );
    }

    let form = null;
    let formComponent = null;

    if (this.state.event) {
      form = this.eventToForm(this.state.event);
      formComponent = (
        <EventForm
          error={this.state.error}
          categories={this.categories}
          event={form}
          editting={editting}
          onSubmit={this.handleOnSubmit}
          submitting={this.state.submitting}
        />
      );
    } else {
      formComponent = (
        <EventForm
          error={this.state.error}
          categories={this.categories}
          onSubmit={this.handleOnSubmit}
          editting={editting}
          submitting={this.state.submitting}
        />
      );
    }

    return (
      <DocumentTitle title={editting ? t("editEvent") : t("createEvent")}>
        <Container>
          <Row>
            <Col md="2" xs="12" className="back-col">
              <div className="form-back float-right">
                <BackLink to={backLocation}>
                  {editting ? t("backEvent") : t("back")}
                </BackLink>
              </div>
            </Col>
            <Col md="8" xs="12">
              {formComponent}
            </Col>
          </Row>
          <Footer />
        </Container>
      </DocumentTitle>
    );
  }
}

export default translate(["errors", "forms"])(EventFormContainer);
