import 'moment/locale/es-us';
import '../../styles/speakerAdder.css';
import React, { Component } from 'react';
import { Card, CardBody, Button, Row, Col, FormGroup, Label, Input, FormFeedback } from 'reactstrap';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import SpeakerItem from './SpeakerItem';

class SpeakerAdder extends Component {
  static propTypes = {
    disable: PropTypes.bool.isRequired,
    speakers: PropTypes.arrayOf(
      PropTypes.shape({
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired
      })
    )
  }

  static defaultProps = { speakers: [] }

  constructor(props) {
    super(props);

    this.state = {
      speakers: props.speakers,
      firstName: '',
      lastName: '',
      email: '',
      formValidated: false      
    };
  }

  handleInputChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleAddSpeaker = e => {
    e && e.preventDefault();
    const { firstName, lastName, email } = this.state;
    const isValid = this.form.checkValidity();
    
    if (!isValid) {
      const hasData = (firstName.length > 0 || lastName.length > 0 || email.length > 0);
      hasData && this.setState({ formValidated: true });
      
      // returns false if invalid and the form has any data
      // returns true if the form is valid or the form is empty
      if (hasData)
        return false;

      return this.state.speakers;
    }

    const speakers = [...this.state.speakers, { firstName, lastName, email }];
    this.setState({ formValidated: true, speakers });

    this.setState({
      firstName: '',
      lastName: '',
      email: '',
      formValidated: false
    });
    
    return speakers; // Not using state.speakers because it does not change synchronously
  }

  getSpeakers = () => this.state.speakers;

  handleDeleteSpeaker = email => {
    this.setState({
      speakers: this.state.speakers.filter(s => s.email !== email)
    });
  }

  errorText = (element, error) => {
    const { t } = this.props;
    return `${t(element)} ${t(error)}`;
  }

  getForm = form => this.form = form;

  render() {
    const { speakers } = this.state;
    const { t, disable } = this.props;
    const speakerItems = speakers.map(s => <SpeakerItem key={s.email} onDelete={this.handleDeleteSpeaker} speaker={s} />);

    return (
      <Row>
        <Col>
          <Label>{t('addSpeakers')}</Label>
          {speakerItems.length > 0 && 
            <Card className="speakers-card">
              <CardBody>
                {speakerItems}
              </CardBody>
            </Card>}
          <form ref={this.getForm} id="speakerForm" noValidate onSubmit={this.handleAddSpeaker} className={this.state.formValidated ? 'was-validated' : ''}>
            <FormGroup row>
              <Col>
                <FormGroup row>
                  <Col>
                    <Input required value={this.state.firstName} onChange={this.handleInputChange} disabled={disable}
                      type="text" name="firstName" id="firstName" placeholder={t('firstName')}
                    />
                    <FormFeedback>{this.errorText('speakerFirstName', 'required')}</FormFeedback>
                  </Col>
                  <Col>
                    <Input required value={this.state.lastName} onChange={this.handleInputChange} disabled={disable}
                      type="text" name="lastName" id="lastName" placeholder={t('lastName')}
                    />
                    <FormFeedback>{this.errorText('speakerLastName', 'required')}</FormFeedback>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col>
                    <Input required value={this.state.email} onChange={this.handleInputChange} disabled={disable}
                      type="email" name="email" id="email" placeholder={t('email')}
                    />
                    <FormFeedback>{this.errorText('email', 'invalid')}</FormFeedback>
                  </Col>
                </FormGroup>
              </Col>
              <Col className="align-self-center col-auto">
                <Button outline color="primary" form="speakerForm" type="submit" disabled={disable} title={t('addSpeaker')}>+</Button>
              </Col>
            </FormGroup>
          </form>
        </Col>
      </Row>
    );
  }
}

export default translate('forms', { withRef: true })(SpeakerAdder);
