import { request2 } from '@/utils/request';

const bidApi = {
  // 分页查询招标列表
  bidPage: '/shqjcpt/operator/bid/page',
  // 查询招标详情
  bidDetail: '/shqjcpt/operator/bid/',
  // 新增招标
  bidAdd: '/shqjcpt/operator/bid',
  // 修改招标
  bidEdit: '/shqjcpt/operator/bid',
  // 删除招标
  bidDelete: '/shqjcpt/operator/bid/',
  // 定标
  bidSelect: '/shqjcpt/operator/bid/select',
  // 中标通知提交
  bidSupplier: '/shqjcpt/operator/bid/supplier/edit',

  // 可转招标需求列表
  demandPage: '/shqjcpt/operator/bid/demand/page',
  // 需求转招标
  demandTransfer: '/shqjcpt/operator/bid/demand/transfer',
  // 可转招标项目列表
  projectPage: '/shqjcpt/operator/bid/project/page',
  // 项目转招标
  projectTransfer: '/shqjcpt/operator/bid/project/transfer',

  // 分页查询评分模板列表
  scoreTemplatePage: '/shqjcpt/operator/bid/score/template/page',
  // 查询评分模板详情
  scoreTemplateDetail: '/shqjcpt/operator/bid/score/template/',
  // 新增评分模板
  scoreTemplateAdd: '/shqjcpt/operator/bid/score/template',
  // 修改评分模板
  scoreTemplateEdit: '/shqjcpt/operator/bid/score/template',
  // 删除评分模板
  scoreTemplateDelete: '/shqjcpt/operator/bid/score/template/',

  // 问题分页列表
  bidQuestionPage: '/shqjcpt/operator/bidQuestion/page',
  // 答疑
  bidQuestionAnswer: '/shqjcpt/operator/bidQuestion/answer',
};

export function bidPage(params) {
  return request2({
    url: bidApi.bidPage,
    method: 'get',
    params,
  });
}

export function bidDetail(id) {
  return request2({
    url: bidApi.bidDetail + id,
    method: 'get',
  });
}

export function bidAdd(parameter) {
  return request2({
    url: bidApi.bidAdd,
    method: 'post',
    data: parameter,
  });
}

export function bidEdit(parameter) {
  return request2({
    url: bidApi.bidEdit,
    method: 'put',
    data: parameter,
  });
}

export function bidDelete(id) {
  return request2({
    url: bidApi.bidDelete + id,
    method: 'delete',
  });
}

export function bidSelect(parameter) {
  return request2({
    url: bidApi.bidSelect,
    method: 'post',
    data: parameter,
  });
}

export function bidSupplier(parameter) {
  return request2({
    url: bidApi.bidSupplier,
    method: 'put',
    data: parameter,
  });
}

export function demandPage(params) {
  return request2({
    url: bidApi.demandPage,
    method: 'get',
    params,
  });
}

export function demandTransfer(data) {
  return request2({
    url: bidApi.demandTransfer,
    method: 'post',
    data,
  });
}

export function projectPage(params) {
  return request2({
    url: bidApi.projectPage,
    method: 'get',
    params,
  });
}

export function projectTransfer(data) {
  return request2({
    url: bidApi.projectTransfer,
    method: 'post',
    data,
  });
}

export function scoreTemplatePage(params) {
  return request2({
    url: bidApi.scoreTemplatePage,
    method: 'get',
    params,
  });
}

export function scoreTemplateDetail(id) {
  return request2({
    url: bidApi.scoreTemplateDetail + id,
    method: 'get',
  });
}

export function scoreTemplateAdd(parameter) {
  return request2({
    url: bidApi.scoreTemplateAdd,
    method: 'post',
    data: parameter,
  });
}

export function scoreTemplateEdit(parameter) {
  return request2({
    url: bidApi.scoreTemplateEdit,
    method: 'put',
    data: parameter,
  });
}

export function scoreTemplateDelete(id) {
  return request2({
    url: bidApi.scoreTemplateDelete + id,
    method: 'delete',
  });
}

export function bidQuestionAnswer(data) {
  return request2({
    url: bidApi.bidQuestionAnswer,
    method: 'post',
    data,
  });
}

export function bidQuestionPage(params) {
  return request2({
    url: bidApi.bidQuestionPage,
    method: 'get',
    params,
  });
}
