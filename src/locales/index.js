// import { createI18n } from 'vue-i18n';
// import storage from 'store';
// import dayjs from 'dayjs';

// // default lang
// import enUS fro./lang/en_US-US';

// export const defaultLang = 'en-US';

// const messages = {
//   'en-US': {
//     ...enUS,
//   },
// };

// const language = (navigator.language || 'en').toLocaleLowerCase(); // 这是获取浏览器的语言
// const i18n = createI18n({
//   legacy: false, // Composition API 模式
//   globalInjection: true, // 全局注册 $t方法
//   global: true,
//   silentTranslationWarn: true,
//   locale: storage.get('lang') || language.split('-')[0] || 'en', // 首先从缓存里拿，没有的话就用浏览器语言
//   fallbackLocale: defaultLang, // 设置备用语言
//   messages,
// });

// const loadedLanguages = [defaultLang];

// function setI18nLanguage(lang) {
//   i18n.locale = lang;
//   // request.headers['Accept-Language'] = lang
//   document.querySelector('html').setAttribute('lang', lang);
//   return lang;
// }

// export function loadLanguageAsync(lang = defaultLang) {
//   return new Promise((resolve) => {
//     // 缓存语言设置
//     storage.set('lang', lang);
//     if (i18n.locale !== lang) {
//       if (!loadedLanguages.includes(lang)) {
//         /* @vite-ignore */
//         return import(/* webpackChunkName: "lang-[request]" */ `./lang/${lang}`).then((msg) => {
//           const locale = msg.default;
//           i18n.setLocaleMessage(lang, locale);
//           loadedLanguages.push(lang);
//           dayjs.locale(locale.dayjsName);
//           return setI18nLanguage(lang);
//         });
//       }
//       return resolve(setI18nLanguage(lang));
//     }
//     return resolve(lang);
//   });
// }

// export function i18nRender(key) {
//   return i18n.t(`${key}`);
// }

// export default i18n;

import { createI18n } from 'vue-i18n';
import storage from 'store';
import { localeMap, localeSample } from './config.js';
import { setHtmlPageLang, setLoadLocalePool } from './helper';
import { APP_LANGUAGE } from '@/store/mutation-types';
import enUS from './lang/en_US';
import zhCN from './lang/zh_CN';

// const language = (navigator.language || 'en_US').toLocaleLowerCase(); // 这是获取浏览器的语言
// async function createI18nOptions() {
//   // let locale = storage.get(APP_LANGUAGE) || language.split('-')[0] || 'en_US'; // 首先从缓存里拿，没有的话就用浏览器语言
//   let locale = storage.get(APP_LANGUAGE) || 'en_US'; // 首先从缓存里拿，没有的话就用浏览器语言
//   locale = localeSample[locale];
//   const defaultLocal = await import(`./lang/${locale || 'en_US'}.js`);
//   const message = defaultLocal.default ?? {};

//   setHtmlPageLang(locale);
//   setLoadLocalePool((loadLocalePool) => {
//     loadLocalePool.push(locale);
//   });

//   // console.log(locale, message);

//   return {
//     locale,
//     legacy: false, // Composition API 模式
//     fallbackLocale: localeMap.en_US, // 设置备用语言
//     messages: {
//       [locale]: message,
//     },
//     globalInjection: true, // 全局注册 $t方法
//     silentTranslationWarn: true, // true - warning off
//     missingWarn: false,
//     silentFallbackWarn: true,
//   };
// }

function createI18nOptions() {
  // let locale = storage.get(APP_LANGUAGE) || 'en_US'; // 首先从缓存里拿，没有的话就用浏览器语言
  let locale ='zh_CN'; // 首先从缓存里拿，没有的话就用浏览器语言

  locale = localeSample[locale];
  setHtmlPageLang(locale);
  setLoadLocalePool((loadLocalePool) => {
    loadLocalePool.push(locale);
  });
  return {
    locale,
    legacy: false, // Composition API 模式
    fallbackLocale: localeMap.en_US, // 设置备用语言
    messages: {
      en_US: { ...enUS },
      zh_CN: { ...zhCN },
    },
    globalInjection: true, // 全局注册 $t方法
    silentTranslationWarn: true, // true - warning off
    missingWarn: false,
    silentFallbackWarn: true,
  };
}

const options = createI18nOptions();
const i18n = createI18n(options);

export default i18n;
