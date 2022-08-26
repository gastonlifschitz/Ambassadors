import '../../styles/errors.css';
import React from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';

const ErrorMessage = ({ title, explanation }) => (
  <DocumentTitle title={title}>
    <div>
      <h1 className="page-error-message">{title}</h1>
      {explanation && <h2 className="page-error-message">{explanation}</h2>}
    </div>
  </DocumentTitle>
);

ErrorMessage.propTypes = {
  title: PropTypes.string.isRequired,
  explanation: PropTypes.string
};

export default ErrorMessage;
