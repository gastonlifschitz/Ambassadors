import React from 'react';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import BackableLink from '../commons/BackableLink';

const FAQBanner = ({ t, className }) => (
  <div>
    <BackableLink to="/faq">
      <Button className="faq-btn" type="button">{t('faqBannerButton')}</Button>
    </BackableLink>
  </div>
);

FAQBanner.propTypes = {
  className: PropTypes.string
};

export default translate('faq')(FAQBanner);
