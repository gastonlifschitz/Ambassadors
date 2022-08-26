import '../../styles/eventPage.css';
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';
import queryString from 'query-string';
import { translate } from 'react-i18next';
import api from '../../services/apiService';
import snackbarService from '../../services/snackbarService';
import Snackbar from '../commons/Snackbar';
import PageFillSpinner from '../spinners/PageFillSpinner';
import EventPage from './EventPage';
import ErrorHandler from '../errors/ErrorHandler';
import ErrorMessage from '../errors/ErrorMessage';
import Footer from '../Footer';
import authService from '../../services/authService';

class EventPageContainer extends Component {
  static propTypes = {
    location: PropTypes.any.isRequired
  }

  state = {
    loading: true,
    event: null,
    error: null
  }

  async componentDidMount() {
    const { id } = this.props.match.params;

    try {
      const response = await api.getEvent(id);
      this.setState({ event: response.data, loading: false });
    }
    catch (error) {
      this.setState({ error, loading: false });
    }
  }

  async handleReview(m, handler) {
    const { event } = this.state;
    const editted = await handler(event.id, m);
    this.setState({ event: editted.data });
  }

  handleEventReject = async m => {
    await this.handleReview(m, api.rejectEvent);
  }

  handleEventApprove = async m => {
    await this.handleReview(m, api.approveEvent);
  }

  handleEventRemove = async m => {
    const fromLink = queryString.parse(this.props.location.search).from || 'approved';
    await this.handleReview(m, api.cancelEvent);
    snackbarService.show('eventRemoved');
    this.props.history.push(`/?show=${fromLink}`);
  }

  render() {
    const { t } = this.props;
    const fromLink = queryString.parse(this.props.location.search).from || 'approved';
    const { isAdmin, uid } = authService.getUser();
    const { event, loading, error } = this.state;

    if (loading)
      return <PageFillSpinner />;

    if (error) {
      return (
        <ErrorHandler error={error}>
          <ErrorMessage title={t('notFoundEvent')} explanation={t('explanationNotFoundEvent')} />
        </ErrorHandler>
      );
    }

    return (
      <DocumentTitle title={event.name}>
        <Fragment>
          <EventPage event={event} isAdmin={isAdmin} isOwner={uid === event.owner.uid} fromLink={fromLink}
            handleApprove={this.handleEventApprove} handleReject={this.handleEventReject} handleDelete={this.handleEventRemove}
          />
          <Footer />
          <Snackbar id="eventRemoved" message={t('eventRemovedFeedback', { name: event.name })} />
        </Fragment>
      </DocumentTitle>
    );
  }
}

export default translate('translations', 'errors')(EventPageContainer);
