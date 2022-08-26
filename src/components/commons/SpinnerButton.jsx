import React from 'react';
import { Button } from 'reactstrap';
import DotSpinner from '../spinners/DotSpinner';

const SpinnerButton = ({ submitting, message, ...props }) => (
  <Button disabled={submitting} {...props}>
    {submitting && <DotSpinner />} {message}
  </Button>
);

export default SpinnerButton;
