import { request2 } from '@/utils/request';

const homeApi = {
  // 分页查询资讯列表
  informationPage: '/shqjcpt/operator/information/page',
  // 查询资讯详情
  informationDetail: '/shqjcpt/operator/information/',
  // 新增资讯
  informationAdd: '/shqjcpt/operator/information',
  // 修改资讯
  informationEdit: '/shqjcpt/operator/information',
  // 删除资讯
  informationDelete: '/shqjcpt/operator/information/',

   // 分页查询推荐列表
   recommenderPage: '/shqjcpt/operator/recommender/page',
   // 查询询推详情
   recommenderDetail: '/shqjcpt/operator/recommender/',
   // 新增询推
   recommenderAdd: '/shqjcpt/operator/recommender',
   // 修改询推
   recommenderEdit: '/shqjcpt/operator/recommender',
   // 删除询推
   recommenderDelete: '/shqjcpt/operator/recommender/',
};

export function informationPage(params) {
  return request2({
    url: homeApi.informationPage,
    method: 'get',
    params,
  });
}

export function informationDetail(id) {
  return request2({
    url: homeApi.informationDetail + id,
    method: 'get',
  });
}

export function informationAdd(parameter) {
  return request2({
    url: homeApi.informationAdd,
    method: 'post',
    data: parameter,
  });
}

export function informationEdit(parameter) {
  return request2({
    url: homeApi.informationEdit,
    method: 'put',
    data: parameter,
  });
}
export function informationDelete(id) {
  return request2({
    url: homeApi.informationDelete + id,
    method: 'delete',
  });
}


export function recommenderPage(params) {
    return request2({
      url: homeApi.recommenderPage,
      method: 'get',
      params,
    });
  }
  
  export function recommenderDetail(id) {
    return request2({
      url: homeApi.recommenderDetail + id,
      method: 'get',
    });
  }
  
  export function recommenderAdd(parameter) {
    return request2({
      url: homeApi.recommenderAdd,
      method: 'post',
      data: parameter,
    });
  }
  
  export function recommenderEdit(parameter) {
    return request2({
      url: homeApi.recommenderEdit,
      method: 'put',
      data: parameter,
    });
  }
  export function recommenderDelete(id) {
    return request2({
      url: homeApi.recommenderDelete + id,
      method: 'delete',
    });
  }