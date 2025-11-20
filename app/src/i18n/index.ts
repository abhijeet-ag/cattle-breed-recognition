import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

// Import translations from correct location
import en from '../../assets/i18n/en.json';
import hi from '../../assets/i18n/hi.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
};

// Get device language
const deviceLanguage = Localization.getLocales()[0]?.languageCode || 'en';

i18n.use(initReactI18next).init({
  resources,
  lng: deviceLanguage, // Start with device language
  fallbackLng: 'en',
  compatibilityJSON: 'v3',
  interpolation: {
    escapeValue: false,
  },
  // Add debugging
  debug: __DEV__ ? true : false,
});

// Add language change listener
i18n.on('languageChanged', (lng) => {
  console.log('🌐 Language changed to:', lng);
});

export default i18n;
