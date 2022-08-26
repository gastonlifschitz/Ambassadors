import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

const Assistants = ({ t, expectedAssistants, finalAssistants }) => {
  if (!finalAssistants)
    return <div>{expectedAssistants} {t('assistants')}</div>;
  return <div>{finalAssistants} {t('finalAssistants')}</div>;
};

Assistants.propTypes = {
  expectedAssistants: PropTypes.number.isRequired,
  finalAssistants: PropTypes.number
};

export default translate()(Assistants);
