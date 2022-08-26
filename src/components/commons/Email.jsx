import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Email = ({ email, subject, className }) => (
  <a className={classNames('am-link', className)} href={`mailto:${email}?Subject=${subject || ''}`}>
    <span className="lnr lnr-envelope"></span>{` ${email}`}
  </a>
);

Email.propTypes = {
  email: PropTypes.string.isRequired,
  subject: PropTypes.string,
  className: PropTypes.string
};

export default Email;
