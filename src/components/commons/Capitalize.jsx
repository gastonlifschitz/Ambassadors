import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

const Capitalize = ({ content }) => (
  <Fragment>
    {content.split(' ').map(word => capitalize(word.toLowerCase())).join(' ')}
  </Fragment>
);

Capitalize.propTypes = {
  content: PropTypes.string.isRequired
};

export default Capitalize;
