import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const BackLink = ({ className, children, ...props }) => (
  <Link className={`am-link ${className}`} {...props}>
    <span className="lnr lnr-chevron-left"></span>{children}
  </Link>
);

BackLink.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

BackLink.defaultProps = {
  className: ''
};

export default BackLink;
