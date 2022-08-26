import '../../styles/spinner.css';
import React from 'react';
import { Row, Col } from 'reactstrap';

const PageFillSpinner = () => (
  <Row className="h-100 align-items-center">
    <Col className="text-center">
      <span className="ibm-spinner"></span>
    </Col>
  </Row>
);

export default PageFillSpinner;
