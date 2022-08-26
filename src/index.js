import 'raf/polyfill';
import 'bootstrap/dist/css/bootstrap.css';
import './styles/common.css';
import './styles/modal.css';
import React from 'react';
import { CookiesProvider } from 'react-cookie';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import App from './components/App';


ReactDOM.render(
  <BrowserRouter>
    <CookiesProvider>
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    </CookiesProvider>
  </BrowserRouter>,
  document.getElementById('root')
);
