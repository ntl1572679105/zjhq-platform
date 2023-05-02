import storage from 'store';
import { login, getInfo } from '@/api/login';
import {
  ACCESS_TOKEN,
  CONSOLE_RIGHTS,
  LOCALHOST_INFO,
  CONSOLE_PERMISSON,
} from '@/store/mutation-types';

const user = {
  state: {
    token: storage.get(ACCESS_TOKEN) || '',
    // 权限数组
    permissions: storage.get(CONSOLE_PERMISSON) || [],
    // 角色数组
    roles: [],
    // 菜单数组
    menus: storage.get(CONSOLE_RIGHTS) || [],
    // 用户信息
    info: storage.get(LOCALHOST_INFO) || {},
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    SET_PERMISSIONS: (state, permissions) => {
      // const list = [];
      // permissions.forEach((element) => {
      //   list.push(element.code);
      // });
      state.permissions = permissions;
      storage.set(CONSOLE_PERMISSON, permissions);
    },
    SET_MENUS: (state, menus) => {
      state.menus = menus;
      storage.set(CONSOLE_RIGHTS, menus);
    },
    SET_INFO: (state, info) => {
      state.info = info;
      storage.set(LOCALHOST_INFO, info);
    },
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo)
          .then((res) => {
            const { token } = res;
            // 保存token
            storage.set(ACCESS_TOKEN, token, 7 * 24 * 60 * 60 * 1000);
            commit('SET_TOKEN', token);
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo()
          .then((res) => {
            console.log(res, 'getInfo');
            commit('SET_PERMISSIONS', res.permissions);
            commit('SET_ROLES', [res]);
            commit('SET_INFO', res);
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 登出
    Logout({ commit, state }) {
      return new Promise((resolve, reject) => {
        storage.remove(ACCESS_TOKEN);
        commit('SET_TOKEN', '');
        commit('SET_PERMISSIONS', []);
        commit('SET_ROLES', []);
        commit('SET_INFO', {});
        resolve();
      });
    },
    // 强制退出
    Reset({ commit }) {
      storage.remove(ACCESS_TOKEN);
      commit('SET_TOKEN', '');
      commit('SET_PERMISSIONS', []);
      commit('SET_ROLES', []);
      commit('SET_INFO', {});
      commit('SET_MENUS', []);
    },
  },
};

export default user;
