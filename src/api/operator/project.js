import { request2 } from '@/utils/request';

const projectApi = {
  // 分页查询采购项目列表
  projectPage: '/shqjcpt/operator/project/page',
  // 查询采购项目详情
  projectDetail: '/shqjcpt/operator/project/',
  // 新增采购项目
  projectAdd: '/shqjcpt/operator/project',
  // 修改采购项目
  projectEdit: '/shqjcpt/operator/project',
  // 提交审核
  projectCommit: '/shqjcpt/operator/project/commit/',
  // 采购项目阶段审核
  projectAudit: '/shqjcpt/operator/project/audit',
};

export function projectPage(params) {
  return request2({
    url: projectApi.projectPage,
    method: 'get',
    params,
  });
}

export function projectDetail(id) {
  return request2({
    url: projectApi.projectDetail + id,
    method: 'get',
  });
}

export function projectAdd(parameter) {
  return request2({
    url: projectApi.projectAdd,
    method: 'post',
    data: parameter,
  });
}

export function projectEdit(parameter) {
  return request2({
    url: projectApi.projectEdit,
    method: 'put',
    data: parameter,
  });
}

export function projectCommit(id) {
  return request2({
    url: projectApi.projectCommit + id,
    method: 'post',
  });
}

export function projectAudit(parameter) {
  return request2({
    url: projectApi.projectAudit,
    method: 'post',
    data: parameter,
  });
}
