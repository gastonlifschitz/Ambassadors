import '../../styles/formCard.css';
import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Card, CardBody } from 'reactstrap';

const CardForm = props => (
  <Card className="form-card">
    <CardBody className="form-card-body">
      <Row className="justify-content-center align-items-end">
        <Col>
          {props.children}
        </Col>
      </Row>
    </CardBody>
  </Card>
);

CardForm.propTypes = {
  children: PropTypes.node.isRequired
};

export default CardForm;
