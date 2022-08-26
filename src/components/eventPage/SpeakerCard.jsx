import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Col, Card, CardBody } from 'reactstrap';
import speakerShape from '../props/Speaker';
import Email from '../commons/Email';

const SpeakerCard = ({ t, speaker, eventName }) => (
  <Col md="4" sm="6">
    <Card className="speaker-card">
      <CardBody>
        <div className="text-holder">
          <span className="text-truncate">{speaker.fullName}</span>
        </div>
        <div className="text-holder">
          <Email className="text-truncate" email={speaker.email} subject={t('joinEvent', { eventName })} />
        </div>
      </CardBody>
    </Card>
  </Col>
);

SpeakerCard.propTypes = {
  speaker: speakerShape.isRequired,
  eventName: PropTypes.string.isRequired
};

export default translate()(SpeakerCard);
