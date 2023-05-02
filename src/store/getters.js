const getters = {
  token: (state) => state.user.token,
  roles: (state) => state.user.roles,
  menus: (state) => state.user.menus,
  userInfo: (state) => state.user.info,
  userId: (state) => state.user.info && state.user.info.user.id,
  addRouters: (state) => state.permission.addRouters,
  permissions: (state) => state.user.permissions,
  lang: (state) => state.app.lang,
  category:(state)=>state.global.category,
  categoryIds:(state)=>state.global.categoryIds,
};

export default getters;
