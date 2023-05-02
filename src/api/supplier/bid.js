import { request } from '@/utils/request';

const bidApi = {
  // 分页查询招标列表
  bidList: '/shqjcpt/supplier/bidSupplier/page',
  // 查询招标详情
  bidDtail: '/shqjcpt/supplier/bidSupplier/',
  // 投标
  bidAdd: '/shqjcpt/supplier/bidSupplier',

  // 提议
  bidQuestion: '/shqjcpt/supplier/bidQuestion',
};

export function bidList(params) {
  return request({
    url: bidApi.bidList,
    method: 'get',
    params,
  });
}

export function bidDtail(id) {
  return request({
    url: bidApi.bidDtail + id,
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

export function bidQuestion(parameter) {
    return request({
      url: bidApi.bidQuestion,
      method: 'post',
      data: parameter,
    });
  }
