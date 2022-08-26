//Ambassadors subscription form 2/2
import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Row,
  Col,
  Modal,
  ModalBody,
  Form,
  FormGroup,
  FormFeedback,
  Label,
  Input,
} from "reactstrap";
import SpinnerButton from "../commons/SpinnerButton";
import { translate } from "react-i18next";
import snackbarService from "../../services/snackbarService";
import api from "../../services/apiService";
import authService from "../../services/authService";

class SubscriptionToEvent extends Component {
  static propTypes = {
    onSubscribe: PropTypes.func.isRequired,
    toggle: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
  };

  state = {
    skills: "",
    interests: "",
    formValidated: false,
    submitting: false,
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubscribe = async () => {
    const subscriber = authService.getUser();
    try {
      await api.subscribe(subscriber);
      snackbarService.show("subscribed", 5000);
      this.forceUpdate();
    } catch (error) {
      snackbarService.show("subscribeError", 7000);
    }
  };

  render() {
    const { toggle, isOpen, t } = this.props;

    return (
      <Modal isOpen={isOpen} toggle={toggle} className="subscriber-modal">
        <Form
          noValidate
          onSubmit={this.handleOnSubmit}
          className={this.state.formValidated ? "was-validated" : ""}
        >
          <ModalBody className="subscription-modal-body">
            <Row>
              <Col>
                <h3>¡Registrate para crear tu primer evento!</h3>
              </Col>
            </Row>
            <FormGroup row>
              <Col>
                Para poder crear un evento, primero debes registrarte como
                embajador. Completá el siguente formulario y sumate a la
                comunidad.
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col>
                <Label for="skills">
                  <span className="lnr lnr-graduation-hat"></span> {t("skills")}
                </Label>
                <Input
                  required
                  value={this.state.skills}
                  onChange={this.handleInputChange}
                  type="textarea"
                  name="skills"
                  id="skills"
                  placeholder={t("skillsPlaceholder")}
                />
                <FormFeedback>{t("skillsRequired")}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col>
                <Label for="interests">
                  <span className="lnr lnr-rocket"></span> {t("interests")}
                </Label>
                <Input
                  required
                  value={this.state.interests}
                  onChange={this.handleInputChange}
                  type="textarea"
                  name="interests"
                  id="interests"
                  placeholder={t("interestsPlaceholder")}
                />
                <FormFeedback>{t("interestsRequired")}</FormFeedback>
              </Col>
            </FormGroup>
            <Row className="justify-content-end">
              <Col xs="auto">
                <SpinnerButton
                  href="/create"
                  className="float-right teal-btn"
                  type="submit"
                  onClick={this.handleSubscribe}
                  message={t("join")}
                />
              </Col>
            </Row>
          </ModalBody>
        </Form>
      </Modal>
    );
  }
}

export default translate("subscriptions")(SubscriptionToEvent);
