import React from 'react';
import PropTypes from 'prop-types';

const Snackbar = ({ id, message, type }) => (
  <div className={`snackbar ${type}`} id={id}>{message}</div> 
);

Snackbar.propTypes = {
  id: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  type: PropTypes.string
};

export default Snackbar;
