//Ambassadors subscription form 1/2
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

class SubscriptionModal extends Component {
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

  handleOnSubmit = async (e) => {
    e.preventDefault();
    this.setState({ formValidated: true });

    if (e.target.checkValidity()) {
      this.setState({ submitting: true });
      await this.props.onSubscribe(this.state);
      this.setState({ submitting: false });
      this.props.toggle();
    }
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  render() {
    const { toggle, isOpen, t } = this.props;
    const { submitting } = this.state;

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
                <h3>{t("wantToBe")}</h3>
              </Col>
            </Row>
            <FormGroup row>
              <Col>{t("firstSteps")}</Col>
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
                  className="float-right teal-btn"
                  type="submit"
                  submitting={submitting}
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

export default translate("subscriptions")(SubscriptionModal);
