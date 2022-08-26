import React from 'react';
import ErrorMessage from './ErrorMessage';
import { translate } from 'react-i18next';

const NotFound = ({ t }) => <ErrorMessage title={t('notFound')} />;

export default translate('errors')(NotFound);
