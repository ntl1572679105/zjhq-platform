import storage from 'store';
import { APP_LANGUAGE } from '@/store/mutation-types';

const app = {
  state: {
    // 当前语言
    lang: 'zh_CN', // storage.get(APP_LANGUAGE) || 'en_US',
  },
  mutations: {
    [APP_LANGUAGE]: (state, lang) => {
      state.lang = lang;
      storage.set(APP_LANGUAGE, lang);
    },
  },
  actions: {
    setLang({ commit }, lang) {
      commit(APP_LANGUAGE, lang);
    },
  },
};

export default app;
