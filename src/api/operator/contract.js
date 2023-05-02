import { request2 } from '@/utils/request';

const contractApi = {
  // 分页查询合同表列表
  contractPage: '/shqjcpt/operator/contract/ContractPage',
  // 查询合同详情
  contractDetail: '/shqjcpt/operator/contract/ContractPage/',
  // 上传合同
  contractAdd: '/shqjcpt/operator/contract',
  // 修改合同
  contractEdit: '/shqjcpt/operator/contract',
  // 删除合同
  contractDelete: '/shqjcpt/operator/contract/',

  // 提交审核
  contractCommit: '/shqjcpt/operator/contract/commit/',
  // 阶段审核
  contractApproval: '/shqjcpt/operator/contract/audit',

  // 分页查询合同类目列表
  contractCategoryPage: '/shqjcpt/contractCategory/page',
  // 查询合同类目详情
  contractCategoryDetail: '/shqjcpt/contractCategory/',
  // 新增合同类目
  contractCategoryAdd: '/shqjcpt/contractCategory',
  // 修改合同类目
  contractCategoryEdit: '/shqjcpt/contractCategory',
  // 删除合同类目
  contractCategoryDelete: '/shqjcpt/contractCategory/',

   // 分页查询廉政合约列表
   IntegrityContractPage: '/shqjcpt/operator/contract/IntegrityContractPage',
   // 查询合廉政合约详情
   IntegrityContractDetail: '/shqjcpt/operator/contract/IntegrityContractPage/',
};

export function contractPage(params) {
  return request2({
    url: contractApi.contractPage,
    method: 'get',
    params,
  });
}

export function contractDetail(id) {
  return request2({
    url: contractApi.contractDetail + id,
    method: 'get',
  });
}

export function contractAdd(parameter) {
  return request2({
    url: contractApi.contractAdd,
    method: 'post',
    data: parameter,
  });
}

export function contractEdit(parameter) {
  return request2({
    url: contractApi.contractEdit,
    method: 'put',
    data: parameter,
  });
}
export function contractDelete(id) {
  return request2({
    url: contractApi.contractDelete + id,
    method: 'delete',
  });
}

export function contractCommit(id) {
  return request2({
    url: contractApi.contractCommit + id,
    method: 'post',
  });
}

export function contractApproval(parameter) {
  return request2({
    url: contractApi.contractApproval,
    method: 'post',
    data: parameter,
  });
}

export function contractCategoryPage(params) {
  return request2({
    url: contractApi.contractCategoryPage,
    method: 'get',
    params,
  });
}

export function contractCategoryDetail(id) {
  return request2({
    url: contractApi.contractCategoryDetail + id,
    method: 'get',
  });
}

export function contractCategoryAdd(parameter) {
  return request2({
    url: contractApi.contractCategoryAdd,
    method: 'post',
    data: parameter,
  });
}

export function contractCategoryEdit(parameter) {
  return request2({
    url: contractApi.contractCategoryEdit,
    method: 'put',
    data: parameter,
  });
}
export function contractCategoryDelete(id) {
  return request2({
    url: contractApi.contractCategoryDelete + id,
    method: 'delete',
  });
}

export function integrityContractPage(params) {
  return request2({
    url: contractApi.IntegrityContractPage,
    method: 'get',
    params,
  });
}

export function integrityContractDetail(id) {
  return request2({
    url: contractApi.IntegrityContractDetail + id,
    method: 'get',
  });
}
