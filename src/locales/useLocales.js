/**
 * Multi-language related operations
 */
import { unref, computed } from 'vue';
import { loadLocalePool, setHtmlPageLang } from './helper';
import { localeSample } from './config';
import i18n from './index.js';
import store from '@/store';
import dayjs from 'dayjs';

function setI18nLanguage(locale) {
  if (i18n.mode === 'legacy') {
    i18n.global.locale = locale;
  } else {
    i18n.global.locale.value = locale;
  }
  store.dispatch('setLang', locale);
  setHtmlPageLang(locale);
}

export function useLocale() {
  const getAntdLocale = computed(() => {
    const getLocale = store.getters.lang;
    // console.log(getLocale);
    const obj = i18n.global.getLocaleMessage(unref(getLocale));
    // console.log(obj);
    dayjs.locale(obj.dayjsName);
    return obj.antLocale;
  });
  const getNaiveLocale = computed(() => {
    const getLocale = store.getters.lang;
    // console.log(getLocale);
    const obj = i18n.global.getLocaleMessage(unref(getLocale));
    console.log(obj,'naiveUi');
    dayjs.locale(obj.dayjsName);
    return { locale: obj.naiveLocale, dateLocale: obj.naiveDateLocale };
  });
  // Switching the language will change the locale of useI18n
  // And submit to configuration modification
  async function changeLocale(locale) {
    const globalI18n = i18n.global;
    const currentLocale = unref(globalI18n.locale);
    if (currentLocale === locale) {
      return locale;
    }

    if (loadLocalePool.includes(locale)) {
      setI18nLanguage(locale);
      return locale;
    }
    const langModule = (await import(`./lang/${localeSample[locale] || 'en_US'}.js`)).default;
    if (!langModule) return;

    globalI18n.setLocaleMessage(locale, langModule);
    loadLocalePool.push(locale);

    setI18nLanguage(locale);
    return locale;
  }

  return {
    // getLocale,
    getNaiveLocale,
    changeLocale,
    getAntdLocale,
  };
}

