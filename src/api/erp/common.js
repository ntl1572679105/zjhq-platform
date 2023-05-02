import { request } from '@/utils/request';

const commonApi = {
  // 获取部门树
  DeptTree: '/erpBase/public/dept/tree',
  // 获取角色列表
  RoleList: '/erpBase/public/role/list',
  // 分页获取用户列表
  UserPage: '/erpBase/public/user/page',
  // 获取用户列表
  UserList: '/erpBase/public/user/list',
};

export function deptTree(params) {
  return request({
    url: commonApi.DeptTree,
    method: 'get',
    params,
  });
}

export function roleList(params) {
  return request({
    url: commonApi.RoleList,
    method: 'get',
    params,
  });
}

export function userPage(params) {
  return request({
    url: commonApi.UserPage,
    method: 'get',
    params,
  });
}

export function userList(params) {
  return request({
    url: commonApi.UserList,
    method: 'get',
    params,
  });
}
