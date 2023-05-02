import { request } from '@/utils/request';

const flowApi = {
  // 分页查询流程定义列表
  ProcessList: '/flowable/process/definition/page',
  // 查询流程定义详情
  ProcessDetail: '/flowable/process/definition/',
  // 新增流程定义
  ProcessAdd: '/flowable/process/definition',
  // 修改流程定义
  ProcessEdit: '/flowable/process/definition',
  // 删除流程定义
  ProcessDelete: '/flowable/process/definition/',

  // 设计流程
  ProcessDesign: '/flowable/process/definition/design',

  /// 业务流程api
  // 新增流程实例
  FlowAdd: '/flowable/process/instance',
  // 查询流程实例详情
  FlowDetailByBusinessKey: '/flowable/process/instance/byBusinessKey/',
  // 查询流程实例详情
  FlowDetailById: '/flowable/process/instance/',
  // 完成流程实例
  FlowComplete: '/flowable/process/instance/complete',
};

export function processList(params) {
  return request({
    url: flowApi.ProcessList,
    method: 'get',
    params,
  });
}

export function processDetail(id) {
  return request({
    url: flowApi.ProcessDetail + id,
    method: 'get',
  });
}

export function processAdd(parameter) {
  return request({
    url: flowApi.ProcessAdd,
    method: 'post',
    data: parameter,
  });
}

export function processEdit(parameter) {
  return request({
    url: flowApi.ProcessEdit,
    method: 'put',
    data: parameter,
  });
}

export function processDelete(id) {
  return request({
    url: flowApi.ProcessDelete + id,
    method: 'delete',
  });
}

export function processDesign(parameter) {
  return request({
    url: flowApi.ProcessDesign,
    method: 'post',
    data: parameter,
  });
}

export function flowAdd(parameter) {
  return request({
    url: flowApi.FlowAdd,
    method: 'post',
    data: parameter,
  });
}

export function flowComplete(parameter) {
  return request({
    url: flowApi.FlowComplete,
    method: 'post',
    data: parameter,
  });
}

export function flowDetailByBusinessKey(businessKey) {
  return request({
    url: flowApi.FlowDetailByBusinessKey + businessKey,
    method: 'get',
  });
}

export function flowDetailById(id) {
  return request({
    url: flowApi.FlowDetailById + id,
    method: 'get',
  });
}
