import '../../styles/completeForm.css';
import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import moment from 'moment';
import DocumentTitle from 'react-document-title';
import { translate } from 'react-i18next';
import authService from '../../services/authService';
import EventComplete from './EventComplete';
import PageFillSpinner from '../spinners/PageFillSpinner';
import api from '../../services/apiService';
import Footer from '../Footer';
import ErrorHandler from '../errors/ErrorHandler';
import ErrorMessage from '../errors/ErrorMessage';
import BackLink from '../commons/BackLink';

class EventCompleteContainer extends Component {
  state = {
    loading: true,
    submitting: false,
    event: null,
    isPastEvent: false,
    error: null
  }

  async componentDidMount() {
    const { id } = this.props.match.params;
    try {
      const response = await api.getEvent(id);
      const event = response.data;
      this.setState({ event, loading: false, isPastEvent: this.isDatePast(event.date) });
    }
    catch (error) {
      this.setState({ error, loading: false });      
    }
  }

  isDatePast(date) {
    const now = moment();
    const otherDate = moment(date);
    return now.diff(otherDate) > 0;
  }

  handleOnSubmit = async submission => {
    const { event } = this.state;
    const { feedback, actualAssistants, speakers } = submission;
    const isEditing = this.isEditing();

    event.feedback = feedback;
    event.assistants.actual = actualAssistants;
    event.speakers = speakers;

    this.setState({ submitting: true });
    
    try {
      if (submission.done && !isEditing)
        await api.completeEvent(event.id, feedback, feedback, actualAssistants, speakers);
      else if (!isEditing)
        await api.cancelEvent(event.id, feedback);
      else
        await api.editEvent(event.id, event);

      this.setState({ submitting: false });

      if (isEditing)
        this.props.history.push(`/event/${event.id}?from=owned`); // Redirect to event details
      else
        this.props.history.push('/completed'); // Redirect to thank you page
    } 
    catch (error) {
      this.setState({ error, submitting: false });
    }
  }

  isAuthorized = () => {
    const { event } = this.state;
    const user = authService.getUser();

    if (!user.isAdmin && user.uid !== event.owner.uid)
      return false;

    return true;
  }

  isEditing = () => this.state.event.state === 'completed';

  render() {
    const { t, match, location } = this.props;
    const { loading, event, error, isPastEvent } = this.state;
    const backLocation = (location.state && location.state.from) || `/event/${match.params.id}?from=owned`;

    if (loading)
      return <PageFillSpinner />;

    if (error) {
      return (
        <ErrorHandler error={error}>
          <ErrorMessage title={t('notFoundEvent')} explanation={t('explanationNotFoundEvent')} />
        </ErrorHandler>
      );
    }

    if (!this.isAuthorized())
      return <ErrorMessage title={t('notAuthorized')} explanation={t('notOwned')} />;

    if (event.state !== 'approved' && event.state !== 'completed')
      return <ErrorMessage title={t('notApproved')} explanation={t('contactUs')} />;

    if (!isPastEvent)
      return <ErrorMessage title={t('notFinished')} explanation={t('comeBackLater')} />;

    // <h2 className="page-error-message">Si querés corregirlo, entrá a Editar.</h2>

    return (
      <DocumentTitle title={t('completeEvent')}>
        <Container>
          <Row>
            <Col md="2" xs="12" className="back-col">
              <div className="form-back float-right">
                <BackLink to={backLocation}>{t('back')}</BackLink>
              </div>
            </Col>
            <Col md="8" xs="12">
              <EventComplete error={this.state.error} event={event} submitting={this.state.submitting} onSubmit={this.handleOnSubmit} />
            </Col>
          </Row>
          <Footer />
        </Container>
      </DocumentTitle>
    );
  }
}

export default translate(['forms', 'errors'])(EventCompleteContainer);
