import { request } from '@/utils/request';

const roleApi = {
  // 查询角色列表
  RoleList: '/erpBase/role/list',
  // 单个角色详情
  roleDetail: '/erpBase/role/',
  // 新增角色
  roleAdd: '/erpBase/role',
  // 修改角色
  roleEdit: '/erpBase/role',
  // 删除角色
  roleDelete: '/erpBase/role/',
  // 所有角色
  roleAll: '/erpBase/role/list/all',
};

export function roleList(parameter) {
  return request({
    url: roleApi.RoleList,
    method: 'get',
    params: parameter,
  });
}

export function roleDetail(roleid) {
  return request({
    url: roleApi.roleDetail + roleid,
    method: 'get',
  });
}

export function roleAdd(parameter) {
  return request({
    url: roleApi.roleAdd,
    method: 'post',
    data: parameter,
  });
}

export function roleEdit(parameter) {
  return request({
    url: roleApi.roleEdit,
    method: 'put',
    data: parameter,
  });
}

export function roleDelete(roleid) {
  return request({
    url: roleApi.roleDelete + roleid,
    method: 'delete',
  });
}

export function roleAll(parameter) {
  return request({
    url: roleApi.roleAll,
    method: 'get',
    data: parameter,
  });
}
