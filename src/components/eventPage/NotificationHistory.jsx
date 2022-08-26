import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import notificationShape from '../props/Notification';
import NotificationItem from './NotificationItem';

const NotificationHistory = ({ notifications }) => (
  <div className="notification-list">
    {notifications.map(notification => <NotificationItem key={notification.timestamp} notification={notification} />)}
  </div>
);

NotificationHistory.propTypes = {
  notifications: PropTypes.arrayOf(notificationShape).isRequired
};

export default translate()(NotificationHistory);
