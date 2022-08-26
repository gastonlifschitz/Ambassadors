import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const BackableLink = ({ to, children, ...props }) => {
  const location = {
    pathname: to,
    state: {
      from: window.location.pathname + window.location.search
    }
  };

  return (
    <Link to={location} {...props}>
      {children}
    </Link>
  );
};

BackableLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

export default BackableLink;
