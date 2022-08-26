import React from 'react';
import { translate } from 'react-i18next';
import { Row, Col } from 'reactstrap';
import moment from 'moment';
import notificationShape from '../props/Notification';
import Capitalize from '../commons/Capitalize';

const actions = {
  edit: { icon: 'pencil', author: true, desc: false },
  creation: { icon: 'star', author: false, desc: false },
  revision: { icon: 'magnifier', author: true, desc: true },
  approval: { icon: 'checkmark-circle', author: true, desc: false },
  completion: { icon: 'file-add', author: false, desc: false },
  completionReminder: { icon: 'alarm', author: false, desc: false },
  cancellation: { icon: 'cross', author: true, desc: true }
};

const NotificationItem = ({ t, notification }) => {
  const { tag, author, description, timestamp } = notification;

  const action = actions[tag];
  const ts = moment(timestamp);
  return (
    <Row className="notification no-gutters">
      <Col xs="auto">
        <span className={`icon lnr lnr-${action.icon}`} /> 
        <span className="tag-name">{t(tag)}</span>
        <span className="timestamp">{`${ts.format('D/M/Y')} ${ts.format('LT')}`}</span>
        {action.author && author && <span className="author"><span className="lnr lnr-user" /><Capitalize content={author.fullName} /></span>}
      </Col>
      {action.desc && description && 
        <Col xs="12">
          <span className="description font-italic">{description}</span>
        </Col>}
    </Row>
  ); 
};

NotificationItem.propTypes = {
  notification: notificationShape.isRequired
};

export default translate('notifications')(NotificationItem);
