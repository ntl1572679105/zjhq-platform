import { request } from '@/utils/request';

const homeApi = {
  // 分页查询资讯列表
  informationPage: '/shqjcpt/common/information/page',
  // 查询资讯详情
  informationDetail: '/shqjcpt/common/information/',

  // 分页查询推荐列表
  recommenderPage: '/shqjcpt/common/recommender/page',
  // 查询推荐详情
  recommenderDetail: '/shqjcpt/common/recommender/',
};

export function informationPage(params) {
  return request({
    url: homeApi.informationPage,
    method: 'get',
    params,
  });
}

export function informationDetail(id) {
  return request({
    url: homeApi.informationDetail + id,
    method: 'get',
  });
}

export function recommenderPage(params) {
    return request({
      url: homeApi.recommenderPage,
      method: 'get',
      params,
    });
  }
  
  export function recommenderDetail(id) {
    return request({
      url: homeApi.recommenderDetail + id,
      method: 'get',
    });
  }
