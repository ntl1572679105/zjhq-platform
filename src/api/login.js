import { request } from '@/utils/request';

const userApi = {
  // 图形验证码
  captchaImage: '/erpBase/common/captcha/image',
  // 登录
  Login: '/erpBase/login',
  // 获取用户信息
  UserInfo: '/erpBase/info',
  // 当前用户菜单
  UserMenu: '/erpBase/menus',
  // 修改密码
  ChangePassword: '/erpBase/updatePwd',
  // 登出
  Logout: '/erpBase/logout',
};

export function getCurrentUserNav() {
  return request({
    url: userApi.UserMenu,
    method: 'get',
  });
}
export function getCaptchaImage(parameter) {
  return request({
    url: userApi.captchaImage,
    method: 'get',
    params: parameter,
  });
}
export function login(parameter) {
  return request({
    url: userApi.Login,
    method: 'post',
    data: parameter,
  });
}

export function changePassword(parameter) {
  return request({
    url: userApi.ChangePassword,
    method: 'put',
    data: parameter,
  });
}

export function getInfo(parameter) {
  return request({
    url: userApi.UserInfo,
    method: 'get',
    params: parameter,
  });
}

export function logout(parameter) {
  return request({
    url: userApi.Logout,
    method: 'post',
    data: parameter,
  });
}
