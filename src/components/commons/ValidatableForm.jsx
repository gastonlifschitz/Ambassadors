import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'reactstrap';
import classNames from 'classnames';

const ValidatableForm = ({ validated, children }) => (
  <Form noValidate className={classNames({ 'was-validated': validated })}>
    {children}
  </Form>
);

ValidatableForm.propTypes = {
  validated: PropTypes.bool,
  children: PropTypes.node.isRequired
};

ValidatableForm.defaultProps = {
  validated: false
};

export default ValidatableForm;
