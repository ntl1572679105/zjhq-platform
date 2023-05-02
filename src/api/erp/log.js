import { request } from '@/utils/request';

const logApi = {
  // 查询操作日志列表
  OperationList: '/erpBase/log/operation/list',
  // 查询登录日志列表
  LoginList: '/erpBase/log/login/list',
};

export function operationList(params) {
  return request({
    url: logApi.OperationList,
    method: 'get',
    params,
  });
}

export function loginList(params) {
  return request({
    url: logApi.LoginList,
    method: 'get',
    params,
  });
}
