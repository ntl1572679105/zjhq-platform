import { set } from 'lodash-es';
// import from './config.js';

export const loadLocalePool = [];

export function setHtmlPageLang(locale) {
  document.querySelector('html')?.setAttribute('lang', locale);
}

export function setLoadLocalePool(cb) {
  cb(loadLocalePool);
}

export function genMessage(langs, prefix = 'lang') {
  const obj = {};

  langs.keys().forEach((key) => {
    const langFileModule = langs(key).default;
    let fileName = key.replace(`./${prefix}/`, '').replace(/^\.\//, '');
    const lastIndex = fileName.lastIndexOf('.');
    fileName = fileName.substring(0, lastIndex);
    const keyList = fileName.split('/');
    const moduleName = keyList.shift();
    const objKey = keyList.join('.');

    if (moduleName) {
      if (objKey) {
        set(obj, moduleName, obj[moduleName] || {});
        set(obj[moduleName], objKey, langFileModule);
      } else {
        set(obj, moduleName, langFileModule || {});
      }
    }
  });
  return obj;
}
