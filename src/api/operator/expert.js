import { request2 } from '@/utils/request';

const expertApi = {
  // 分页查询专家列表
  expertPage: '/shqjcpt/operator/expert/page',
  // 查询专家详情
  expertDetail: '/shqjcpt/operator/expert/',
  // 新增专家
  expertAdd: '/shqjcpt/operator/expert',
  // 修改专家
  expertEdit: '/shqjcpt/operator/expert',
  // 删除专家
  expertDelete: '/shqjcpt/operator/expert/',
};

export function expertPage(params) {
  return request2({
    url: expertApi.expertPage,
    method: 'get',
    params,
  });
}

export function expertDetail(id) {
  return request2({
    url: expertApi.expertDetail + id,
    method: 'get',
  });
}

export function expertAdd(parameter) {
  return request2({
    url: expertApi.expertAdd,
    method: 'post',
    data: parameter,
  });
}

export function expertEdit(parameter) {
  return request2({
    url: expertApi.expertEdit,
    method: 'put',
    data: parameter,
  });
}
export function expertDelete(id) {
  return request2({
    url: expertApi.expertDelete + id,
    method: 'delete',
  });
}
