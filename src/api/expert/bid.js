import { request } from '@/utils/request';

const bidApi = {
  // 分页查询评标列表
  bidList: '/shqjcpt/expert/bidExpert/page',
  // 查询评标单详情
  bidDetail: '/shqjcpt/expert/bidExpert/',
  // 提交评标
  bidAdd: '/shqjcpt/expert/bidExpert/submit',
};

export function bidList(params) {
  return request({
    url: bidApi.bidList,
    method: 'get',
    params,
  });
}

export function bidDetail(id) {
  return request({
    url: bidApi.bidDetail + id,
    method: 'get',
  });
}

export function bidAdd(parameter) {
  return request({
    url: bidApi.bidAdd,
    method: 'post',
    data: parameter,
  });
}
