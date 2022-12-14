import i18n from 'i18next';
import Backend from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { reactI18nextModule } from 'react-i18next';

i18n
  .use(LanguageDetector)
  .use(Backend)
  .use(reactI18nextModule)
  .init({
    fallbackLng: 'es',

    // Have a common namespace used around the full app
    ns: ['translations', 'forms', 'errors'],
    defaultNS: 'translations',

    debug: false,
    preload: false,

    // Supported languages
    whitelist: ['es'],
    nonExplicitWhitelist: false,

    interpolation: {
      escapeValue: false,
    },

    react: {
      wait: true,
      nsMode: 'fallback'
    }
  });

export default i18n;
