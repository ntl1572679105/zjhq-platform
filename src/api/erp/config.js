import { request } from '@/utils/request';

const configApi = {
  // 查询配置列表
  ConfigList: '/erpBase/config/list',
  // 获取配置详情
  ConfigDetail: '/erpBase/config/',
  // 新增配置
  ConfigAdd: '/erpBase/config',
  // 修改配置
  ConfigEdit: '/erpBase/config',
  // 删除配置
  ConfigDelete: '/erpBase/config/',
};

export function configList(parameter) {
  return request({
    url: configApi.ConfigList,
    method: 'get',
    params: parameter,
  });
}

export function configDetail(configid) {
  return request({
    url: configApi.ConfigDetail + configid,
    method: 'get',
  });
}

export function configAdd(parameter) {
  return request({
    url: configApi.ConfigAdd,
    method: 'post',
    data: parameter,
  });
}

export function configEdit(parameter) {
  return request({
    url: configApi.ConfigEdit,
    method: 'put',
    data: parameter,
  });
}

export function configDelete(configid) {
  return request({
    url: configApi.ConfigDelete + configid,
    method: 'delete',
  });
}
