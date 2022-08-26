import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button } from 'reactstrap';
import speakerShape from '../props/Speaker';

class SpeakerItem extends Component {
  static propTypes = {
    speaker: speakerShape,
    onDelete: PropTypes.func.isRequired
  }

  submitDelete = () => {
    const { speaker, onDelete } = this.props;
    onDelete(speaker.email);
  }

  render() {
    const { speaker } = this.props;
    return (
      <div className="speaker-item">
        <Row>
          <Col md="10">
            <Row>
              <Col>
                <div>{`${speaker.firstName} ${speaker.lastName}`}</div>
              </Col>
            </Row>
            <Row>
              <Col className="light">
                <div>{speaker.email}</div>
              </Col>
            </Row>
          </Col>
          <Col md="2" className="align-self-center">
            <Button className="float-right" outline color="danger" onClick={this.submitDelete}><span className="lnr lnr-trash"></span></Button>
          </Col>
        </Row>
      </div>
    );
  }
}


export default SpeakerItem;
