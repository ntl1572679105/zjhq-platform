import { createStore } from 'vuex';

import user from './modules/user.js';
import app from './modules/app';
import global from "./modules/global.js"

// default router permission control
// import permission from './modules/permission'

// dynamic router permission control (Experimental)
import permission from './modules/async-router.js';
import getters from './getters';

export default createStore({
  modules: {
    app,
    user,
    permission,
    global
  },
  state: {},
  mutations: {},
  actions: {},
  getters,
});
