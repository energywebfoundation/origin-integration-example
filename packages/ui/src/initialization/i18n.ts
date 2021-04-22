import { ORIGIN_LANGUAGE, ORIGIN_LANGUAGES } from '@energyweb/localization';
import i18n from 'i18next';
import ICU from 'i18next-icu';
import { initReactI18next } from 'react-i18next';

export const initializeI18N = (
  language: ORIGIN_LANGUAGE,
  fallbackLanguage: ORIGIN_LANGUAGE,
) => {
  i18n.use(new ICU())
      .use(initReactI18next)
      .init({
          resources: ORIGIN_LANGUAGES,
          lng: language,
          fallbackLng: fallbackLanguage,

          interpolation: {
              escapeValue: false
          }
      });

  return i18n;
};