import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import EventCard from './EventCard';
import eventShape from '../props/Event';

const CardList = ({ t, items, fromLink }) => {
  const listItems = items
    .map(item => (
      <EventCard key={item._id} item={item} fromLink={fromLink} /> 
    ));

  return (
    <Fragment>
      {listItems}
    </Fragment>
  );
};

CardList.propTypes = {
  items: PropTypes.arrayOf(eventShape),
  fromLink: PropTypes.string.isRequired
};

export default CardList;
