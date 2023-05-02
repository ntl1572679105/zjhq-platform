import { request2 } from '@/utils/request';

const demandApi = {
  // 分页查询需求类目列表
  CategoryPage: '/shqjcpt/operator/demand/category/page',
  // 查询需求类目详情
  CategoryDetail: '/shqjcpt/operator/demand/category/',
  // 新增需求类目
  CategoryAdd: '/shqjcpt/operator/demand/category',
  // 修改代理机构
  CategoryEdit: '/shqjcpt/operator/demand/category',
  // 删除需求类目
  CategoryDelete: '/shqjcpt/operator/demand/category/',
  // 所有分类
  CategoryAll: '/shqjcpt/operator/demand/category/all',

  // 新增需求类目规格
  CategorySpecAdd: '/shqjcpt/operator/demand/categorySpec',
  // 修改需求类目规格
  CategorySpecEdit: '/shqjcpt/operator/demand/categorySpec',
  // 删除需求类目规格
  CategorySpecDelete: '/shqjcpt/operator/demand/categorySpec/',

  // 分页查询需求列表
  DemandPage: '/shqjcpt/operator/demand/page',
  // 查询需求详情
  DemandDetail: '/shqjcpt/operator/demand/',
  // 新增需求
  DemandAdd: '/shqjcpt/operator/demand',
  // 修改需求
  DemandEdit: '/shqjcpt/operator/demand',
  // 提交审核
  DemandCommit: '/shqjcpt/operator/demand/commit/',
  // 需求阶段审核
  DemandAudit: '/shqjcpt/operator/demand/audit',

  // 分页查询需求分配列表
  AssignPage: '/shqjcpt/operator/demand/assign/page',
  // 分配
  DemandAssign: '/shqjcpt/operator/demand/assign',
  // 作废
  AssignCancel: '/shqjcpt/operator/demand/assign/cancel/',

  // 分页查询需求类目预算列表
  BudgetPage: '/shqjcpt/operator/demand/category/budget/page',
  // 查询需求类目预算详情
  BudgetDetail: '/shqjcpt/operator/demand/category/budget/',
};

export function categoryPage(params) {
  return request2({
    url: demandApi.CategoryPage,
    method: 'get',
    params,
  });
}

export function categoryDetail(id) {
  return request2({
    url: demandApi.CategoryDetail + id,
    method: 'get',
  });
}

export function categoryAdd(parameter) {
  return request2({
    url: demandApi.CategoryAdd,
    method: 'post',
    data: parameter,
  });
}

export function categoryEdit(parameter) {
  return request2({
    url: demandApi.CategoryEdit,
    method: 'put',
    data: parameter,
  });
}

export function categoryDelete(id) {
  return request2({
    url: demandApi.CategoryDelete + id,
    method: 'delete',
  });
}

export function categoryAll(params) {
  return request2({
    url: demandApi.CategoryAll,
    method: 'get',
    params,
  });
}

export function categorySpecAdd(parameter) {
  return request2({
    url: demandApi.CategorySpecAdd,
    method: 'post',
    data: parameter,
  });
}

export function categorySpecEdit(parameter) {
  return request2({
    url: demandApi.CategorySpecEdit,
    method: 'put',
    data: parameter,
  });
}

export function categorySpecDelete(id) {
  return request2({
    url: demandApi.CategorySpecDelete + id,
    method: 'delete',
  });
}

export function demandPage(params) {
  return request2({
    url: demandApi.DemandPage,
    method: 'get',
    params,
  });
}

export function demandDetail(id) {
  return request2({
    url: demandApi.DemandDetail + id,
    method: 'get',
  });
}

export function demandAdd(parameter) {
  return request2({
    url: demandApi.DemandAdd,
    method: 'post',
    data: parameter,
  });
}

export function demandEdit(parameter) {
  return request2({
    url: demandApi.DemandEdit,
    method: 'put',
    data: parameter,
  });
}

export function demandCommit(id) {
  return request2({
    url: demandApi.DemandCommit + id,
    method: 'post',
  });
}

export function demandAudit(parameter) {
  return request2({
    url: demandApi.DemandAudit,
    method: 'post',
    data: parameter,
  });
}

export function assignPage(params) {
  return request2({
    url: demandApi.AssignPage,
    method: 'get',
    params,
  });
}

export function demandAssign(parameter) {
  return request2({
    url: demandApi.DemandAssign,
    method: 'post',
    data: parameter,
  });
}

export function assignCancel(id) {
  return request2({
    url: demandApi.AssignCancel + id,
    method: 'post',
  });
}

export function budgetPage(params) {
  return request2({
    url: demandApi.BudgetPage,
    method: 'get',
    params,
  });
}

export function budgetDetail(id) {
  return request2({
    url: demandApi.BudgetDetail + id,
    method: 'get',
  });
}
