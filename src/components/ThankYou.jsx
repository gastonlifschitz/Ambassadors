import React from 'react';
import { translate } from 'react-i18next';
import DocumentTitle from 'react-document-title';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';
import CardForm from './forms/CardForm';
import '../styles/thankYou.css';

const ThankYou = ({ t }) => (
  <DocumentTitle title={t('thankYouTitle')}>
    <Container className="page-center text-center">
      <Row className="justify-content-center">
        <Col>
          <CardForm>
            <div className="thanks-container">
              <h3>{t('completedSuccesfully')}</h3>
              <div className="thanks-text">
                <p>{t('thankYou')}</p>
                <p>{t('weCountOnYou')}</p>
                <p>{t('rememberLoadHours')}
                  <a className="am-link-blue" rel="noopener noreferrer" href="https://www.ibm.com/volunteers/home.wss" target="_blank">IBM Volunteers</a>.
                </p>
              </div>
              <Link className="am-link-blue" to="/events">{t('seeUpcomingEvents')}</Link>
            </div>
          </CardForm>
        </Col>
      </Row>
    </Container>
  </DocumentTitle>
);

export default translate('translations')(ThankYou);
