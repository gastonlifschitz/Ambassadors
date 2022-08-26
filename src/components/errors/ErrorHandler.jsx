import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import ErrorMessage from './ErrorMessage';

const ErrorHandler = ({ t, error, children, status }) => {
  status = status || error.response.status;
  if (!error.response.status)
    return <ErrorMessage title={t('noConnection')} explanation={t('tryLater')} />;
  if (status === error.response.status)
    return children;
  return null;
};

ErrorHandler.propTypes = {
  error: PropTypes.object.isRequired,
  status: PropTypes.number,
  children: PropTypes.node
};

export default translate('errors')(ErrorHandler);
