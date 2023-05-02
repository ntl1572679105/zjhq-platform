import { request } from '@/utils/request';

const demandApi = {
  // 分页查询需求分配列表
  demandList: '/shqjcpt/agent/demand/assign/page',
  // 查询需求详情
  demandDetail: '/shqjcpt/agent/demand/assign/',
  // 受理
  demandAccept: '/shqjcpt/agent/demand/assign/accept',
};

export function demandList(params) {
  return request({
    url: demandApi.demandList,
    method: 'get',
    params,
  });
}

export function demandDetail(id) {
  return request({
    url: demandApi.demandDetail + id,
    method: 'get',
  });
}

export function demandAccept(parameter) {
  return request({
    url: demandApi.demandAccept,
    method: 'post',
    data: parameter,
  });
}
