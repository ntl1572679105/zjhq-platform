import { request2 } from '@/utils/request';

const agentApi = {
  // 分页查询代理机构列表
  AgentPage: '/shqjcpt/operator/agent/page',
  // 查询代理机构详情
  AgentDetail: '/shqjcpt/operator/agent/',
  // 新增代理机构
  AgentAdd: '/shqjcpt/operator/agent',
  // 修改代理机构
  AgentEdit: '/shqjcpt/operator/agent',
  // 淘汰
  AgentEliminate: '/shqjcpt/operator/agent/eliminate/',

  // 分页查询代理机构用户列表
  UserPage: '/shqjcpt/operator/agent/user/page',
  // 新增代理机构用户
  UserAdd: '/shqjcpt/operator/agent/user',
  // 删除代理机构用户
  UserDelete: '/shqjcpt/operator/agent/user/',
};

export function agentPage(params) {
  return request2({
    url: agentApi.AgentPage,
    method: 'get',
    params,
  });
}

export function agentDetail(id) {
  return request2({
    url: agentApi.AgentDetail + id,
    method: 'get',
  });
}

export function agentAdd(parameter) {
  return request2({
    url: agentApi.AgentAdd,
    method: 'post',
    data: parameter,
  });
}

export function agentEdit(parameter) {
  return request2({
    url: agentApi.AgentEdit,
    method: 'put',
    data: parameter,
  });
}

export function agentEliminate(id) {
  return request2({
    url: agentApi.AgentEliminate + id,
    method: 'post',
  });
}

export function userPage(params) {
  return request2({
    url: agentApi.UserPage,
    method: 'get',
    params,
  });
}

export function userAdd(parameter) {
  return request2({
    url: agentApi.UserAdd,
    method: 'post',
    data: parameter,
  });
}

export function userDelete(id) {
  return request2({
    url: agentApi.UserDelete + id,
    method: 'delete',
  });
}
