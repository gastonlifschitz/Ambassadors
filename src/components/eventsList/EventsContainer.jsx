import '../../styles/snackbar.css';
import React, { Component, Fragment } from 'react';
import linkParser from 'parse-link-header';
import queryString from 'query-string';
import { translate } from 'react-i18next';
import { Row, Col, Container, Badge, Tooltip } from 'reactstrap';
import DocumentTitle from 'react-document-title';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroll-component';
import authService from '../../services/authService';
import snackbarService from '../../services/snackbarService';
import api from '../../services/apiService';
import Snackbar from '../commons/Snackbar';
import PageFillSpinner from '../spinners/PageFillSpinner';
import ErrorMessage from '../errors/ErrorMessage';
import CardList from './CardList';
import Footer from '../Footer';

class EventsContainer extends Component {
  state = {
    approved: { items: [], page: 1, loading: true, error: null, hasMore: true },
    needCompletion: { items: [], page: 1,loading: true, error: null, hasMore: true },
    completed: { items: [], page: 1, loading: true, error: null, hasMore: true },
    owned: { items: [], page: 1, loading: true, error: null, hasMore: true },
    scheduled: { items: [], page: 1, loading: true, error: null, hasMore: true },
    uncompletedTooltip: false
  }

  beginDay = moment().set({ hour: 0, minute: 0, second: 0 });

  componentDidMount() {
    ['approved', 'completed', 'owned'].forEach(field => this.fetchEvents(field));

    if (this.isAdmin())
      ['scheduled', 'needCompletion'].forEach(field => this.fetchEvents(field));
  }

  isAdmin() {
    return authService.getUser().isAdmin;
  }

  isSubscriber() {
    return authService.getUser().isSubscriber;
  }

  getEventsByState(params, field) {
    const paramsWithPage = { ...params, page: this.state[field].page };
    this.getEvents(field || params.state, () => api.getEvents(paramsWithPage)); 
  }

  needsCompletion = event => event.state === 'approved' && moment(event.date) < this.beginDay.toDate()

  // TODO: todo esto anda mal si los eventos del embajador ocupan mas de una página. FIX!
  /* Changes order of elements received from the API. If the owner has events that need completion
  ** (i.e. approved and of past date), they are pushed to the beginning of the events list. Those 
  ** events that are not completed are sorted by date, from the oldest to the newest one. 
  */
  ownerEventsSort = items => {
    for (let i = 0; i < items.length; i++) {
      if (this.needsCompletion(items[i])) {
        items.splice(0, 0, items.splice(i, 1)[0]); // move element to the beginning of the array.
        i++;
      }
    }

    let needsCompletionLen = 0;

    while (needsCompletionLen < items.length && this.needsCompletion(items[needsCompletionLen]))
      needsCompletionLen++;

    // Sort uncompleted events asc by date
    for (let i = 0; i < needsCompletionLen; i++) {
      for (let j = 0; j < needsCompletionLen - 1 - i; j++) {
        if (items[j + 1].date < items[j].date) {
          const tmp = items[j + 1];
          items[j + 1] = items[j];
          items[j] = tmp;
        }
      }
    }
  }

  getOwnerEvents() {
    const { uid } = authService.getUser();
    this.getEvents('owned', () => api.getEvents({ uid, order: 'desc', excludeState: 'cancelled', page: this.state.owned.page }), this.ownerEventsSort);
  }

  /* Fetches events from the API, according to the field.  
  ** Optionally, it receives a method to sort the received items, which is called before assigning the items to the 
  ** state. sortItems should sort the event list in place.
  */
  getEvents(field, request, sortItems) {
    request()
      .then(response => ({
        data: response.data,
        link: linkParser(response.headers.link)
      }))
      .then(response => {
        this.setState(state => {
          const newItems = state[field].items.concat(response.data);
          
          if (sortItems)
            sortItems(newItems);

          return { [field]: {
            items: newItems,
            loading: false,
            page: state[field].page + 1,
            hasMore: response.link && !!response.link.next
          } }; 
        });
      })
      .catch(error => {
        this.setState({ [field]: { error, loading: false } });
      });    
  }

  handleSubscribe = async subscriber => {
    try {
      await api.subscribe(subscriber);
      snackbarService.show('subscribed', 5000);
      this.forceUpdate();
    }
    catch (error) {
      snackbarService.show('subscribeError', 7000);
    }
  }

  fetcher = {
    approved: () => this.getEventsByState({ state: 'approved', order: 'asc', minDate: this.beginDay.toDate() }, 'approved'),
    completed: () => this.getEventsByState({ state: 'completed', order: 'desc' }, 'completed'),
    owned: () => this.getOwnerEvents(),
    scheduled: () => this.getEventsByState({ state: 'scheduled', order: 'desc' }, 'scheduled'),
    needCompletion: () => this.getEventsByState({ state: 'approved', order: 'asc', maxDate: this.beginDay.toDate() }, 'needCompletion')
  }

  fetchEvents = field => {
    field = field || this.show();
    this.fetcher[field]();
  }

  show = () => {
    const { location } = this.props;
    let { show } = queryString.parse(location.search);

    if (!this.state[show])
      show = 'approved';

    return show;    
  }

  toggle = e => {
    this.setState(({ uncompletedTooltip }) => ({ uncompletedTooltip: !uncompletedTooltip }));
  }

  render() {
    const { t } = this.props;
    const show = this.show();
    const { items, loading, error, hasMore } = this.state[show];
    const isAdmin = this.isAdmin();
    // const isSubscriber = this.isSubscriber();
    const uncompleted = this.state.owned.items.filter(this.needsCompletion);
    if (loading)
      return <PageFillSpinner />;

    if (error)
      return <ErrorMessage title={t('noConnection')} explanation={t('tryLater')} />;

    // TODO: el tooltip tarda un milisegundo y queda mal
    return (
      <DocumentTitle title="IBM Ambassadors"> 
        <Container>
          <h2 className="section-title">
            Eventos
          </h2>
          <Row className="justify-content-center sections-row">
            <Col>
              <div className="nav-links">
                <Link className={classNames('am-link', { active: show === 'approved' })} to="/events/?show=approved">{t('nextEvents')}</Link>
                <Link className={classNames('am-link', { active: show === 'completed' })} to="/events/?show=completed">{t('finishedEvents')}</Link>
                <Link id="myEventsTab" className={classNames('am-link', { active: show === 'owned' })} to="/events/?show=owned">
                  {t('myEvents')}
                  {uncompleted.length > 0 && 
                    <Fragment>
                      <Badge>{uncompleted.length}</Badge>
                      <Tooltip placement="top" isOpen={this.state.uncompletedTooltip} target="myEventsTab" toggle={this.toggle}>
                        {t('uncompletedEvents', { count: uncompleted.length })}
                      </Tooltip>
                    </Fragment>}
                </Link>
                {isAdmin && <Link className={classNames('am-link am-link-teal', { active: show === 'scheduled' })} to="/events/?show=scheduled">{t('revision')}</Link>}
                {isAdmin && <Link className={classNames('am-link am-link-teal', { active: show === 'needCompletion' })} to="/events/?show=needCompletion">{t('needCompletion')}</Link>}
              </div>
            </Col>
          </Row>
          <div className="events-flex-container">
            {items.length > 0 && 
              <InfiniteScroll
                dataLength={items.length}
                next={this.fetchEvents}
                hasMore={hasMore}
                loader={<PageFillSpinner />}
              >
                <div className="flex-container">
                  <CardList items={items} isAdmin={isAdmin} fromLink={show} />
                </div>
              </InfiniteScroll>}
            {items.length === 0 &&
              <div className="zrp">
                <h6>{t('noEvents')}</h6>
              </div>}
          </div>
          <Footer />
          <Snackbar id="subscribed" type="info" message={t('subscribeFeedback')} />
          <Snackbar id="subscribeError" type="warning" message={t('subscribeError')} />
        </Container>
      </DocumentTitle>
    );   
  }
}

export default translate(['translations', 'subscriptions', 'errors'])(EventsContainer);
