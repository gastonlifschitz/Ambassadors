import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, FormFeedback, Label, Input } from 'reactstrap';
import { translate } from 'react-i18next';
import event from '../props/Event';
import SpinnerButton from '../commons/SpinnerButton';

class ReviewModal extends Component {
  static propTypes = {
    event,
    onSubmit: PropTypes.func.isRequired,  
    toggle: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    buttonType: PropTypes.string.isRequired,
    buttonMessage: PropTypes.string.isRequired,
    label: PropTypes.node.isRequired,
    placeholder: PropTypes.string
  }

  static defaultProps = {
    placeholder: ''
  }

  state = {
    message: '',
    formValidated: false,
    submitting: false
  }

  handleOnSubmit = async e => {
    e.preventDefault();
    const { message } = this.state;
    this.setState({ formValidated: true });

    if (e.target.checkValidity()) {
      this.setState({ submitting: true });
      await this.props.onSubmit(message);
      this.setState({ submitting: false });
      this.props.toggle();
    }
  }

  handleInputChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  render() {
    const { event, toggle, isOpen, buttonType, buttonMessage, placeholder, label, t } = this.props;
    const { submitting } = this.state;
    return (
      <Modal isOpen={isOpen} toggle={toggle} className="review-modal">
        <Form noValidate onSubmit={this.handleOnSubmit} className={this.state.formValidated ? 'was-validated' : ''}>
          <ModalHeader toggle={toggle}>{event.name}</ModalHeader>
          <ModalBody>
            <FormGroup row>
              <Col>
                <Label for="message">{label}</Label>
                <Input required onChange={this.handleInputChange} type="textarea" name="message" id="message" placeholder={placeholder} />
                <FormFeedback>{t('insertMessage')}</FormFeedback>
              </Col>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button outline color="secondary" onClick={toggle}>{t('cancel')}</Button>
            <SpinnerButton color={buttonType} type="submit" submitting={submitting} message={buttonMessage} />
          </ModalFooter>
        </Form>
      </Modal>
    );
  }  
} 

export default translate()(ReviewModal);
