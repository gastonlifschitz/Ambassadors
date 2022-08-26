import React from 'react';
import PropTypes from 'prop-types';
import { Row } from 'reactstrap';
import SpeakerCard from './SpeakerCard';
import speakerShape from '../props/Speaker';

const SpeakerList = ({ t, items, eventName }) => {
  const listItems = items
    .map(item => (
      <SpeakerCard key={item.email} speaker={item} eventName={eventName} /> 
    ));

  return <Row>{listItems}</Row>;
};

SpeakerList.propTypes = {
  items: PropTypes.arrayOf(speakerShape),
  eventName: PropTypes.string.isRequired
};

export default SpeakerList;
