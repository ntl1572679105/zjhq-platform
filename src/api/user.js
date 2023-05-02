import { request } from '@/utils/request';

const userApi = {
  // 查询管理员列表
  UserList: '/erpBase/user/list',
  // 单个管理员详情
  UserDetail: '/erpBase/user/',
  // 新增管理员
  UserAdd: '/erpBase/user',
  // 修改管理员
  UserEdit: '/erpBase/user',
  // 删除管理员
  UserDelete: '/erpBase/user/',
  // 重置管理员密码
  UserReset: '/erpBase/user/resetPwd',
};

export function userList(parameter) {
  return request({
    url: userApi.UserList,
    method: 'get',
    params: parameter,
  });
}

export function userDetail(userid) {
  return request({
    url: userApi.UserDetail + userid,
    method: 'get',
  });
}

export function userAdd(parameter) {
  return request({
    url: userApi.UserAdd,
    method: 'post',
    data: parameter,
  });
}

export function userEdit(parameter) {
  return request({
    url: userApi.UserEdit,
    method: 'put',
    data: parameter,
  });
}

export function userDelete(userid) {
  return request({
    url: userApi.UserDelete + userid,
    method: 'delete',
  });
}

export function userReset(parameter) {
  return request({
    url: userApi.UserReset,
    method: 'put',
    data: parameter,
  });
}
