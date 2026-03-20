import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './locales/en'
import fr from './locales/fr'
import mc from './locales/mc'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      mc: { translation: mc },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'fr', 'mc'],
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'rusa_lang',
    },
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
