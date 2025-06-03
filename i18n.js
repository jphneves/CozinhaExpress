import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

i18next
  .use(initReactI18next)
  .init({
    resources: {
      pt: {
        translation: {
          chicken: 'frango',
          tomato: 'tomate',
          Arrabiata: 'Arrabiata',
        },
      },
    },
    lng: RNLocalize.getLocales()[0].languageCode || 'pt',
    fallbackLng: 'pt',
    interpolation: { escapeValue: false },
  });

export default i18next; 