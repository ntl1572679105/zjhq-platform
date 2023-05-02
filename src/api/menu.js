import { request } from '@/utils/request';

const menuApi = {
  // 菜单列表
  MenuList: '/erpBase/menu/list',
  // 单个菜单详情
  MenuDetail: '/erpBase/menu/',
  // 新增菜单
  MenuAdd: '/erpBase/menu',
  // 修改菜单
  MenuEdit: '/erpBase/menu',
  // 删除菜单
  MenuDelete: '/erpBase/menu/',
};

export function menuList(parameter) {
  return request({
    url: menuApi.MenuList,
    method: 'get',
    params: parameter,
  });
}

export function menuDetail(menuid) {
  return request({
    url: menuApi.MenuDetail + menuid,
    method: 'get',
  });
}

export function menuAdd(parameter) {
  return request({
    url: menuApi.MenuAdd,
    method: 'post',
    data: parameter,
  });
}

export function menuEdit(parameter) {
  return request({
    url: menuApi.MenuEdit,
    method: 'put',
    data: parameter,
  });
}

export function menuDelete(menuid) {
  return request({
    url: menuApi.MenuDelete + menuid,
    method: 'delete',
  });
}
