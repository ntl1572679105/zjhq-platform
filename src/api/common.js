import { request, request2 } from '@/utils/request';

const commonApi = {
  // 上传文件
  upload: '/shqjcpt/common/file/upload',
  // 下载文件
  down: '/shqjcpt/common/file/download',
  // 公共上传
  publicUpload: '/shqjcpt/common/file/upload',

  // 获取字典数据, 根据创建的字典类型id
  dictList: '/shqjcpt/common/dict/list/',

  // 获取当前用户所属机构下的所有机构成员
  AgentList: '/shqjcpt/common/agent/list',
  // 获取所有机构
  AgentAll: '/shqjcpt/common/agent/all',
  // 获取所有评分模板
  ScoreTemplateList: '/shqjcpt/common/scoreTemplate/list',
  // 获取所有专家
  ExpertList: '/shqjcpt/common/expert/list',
  // 商品列表
  ProductList: '/shqjcpt/common/product/list/',
  // 根据sku商品列表
  SkuList: '/shqjcpt/common/product/bySku/',

  // 获取所有类目预算
  BudgetList: '/shqjcpt/common/budget/list',
  // 根据一级类目id获取类目预算
  BudgetDetail: '/shqjcpt/common/budget/',
  // 查询入围供应商列表
  SupplierList: '/shqjcpt/common/supplier/page',
  // 获取所有合同一级类目
  ContractList: '/shqjcpt/common/contract/list',
  // 所有类目分类
  CategoryAll: '/shqjcpt/common/demand/category/all',
};

export function PublicUpload(parameter) {
  return request2({
    url: commonApi.publicUpload,
    method: 'post',
    data: parameter,
  });
}
export function Upload(parameter) {
  return request2({
    url: commonApi.upload,
    method: 'post',
    data: parameter,
  });
}

export function download(params) {
  return request2({
    url: commonApi.down,
    method: 'get',
    params,
    responseType: 'blob',
  });
}

export function dictList(id) {
  return request2({
    url: commonApi.dictList + id,
    method: 'get',
  });
}

export function agentList(params) {
  return request2({
    url: commonApi.AgentList,
    method: 'get',
    params,
  });
}

export function agentAll(params) {
  return request2({
    url: commonApi.AgentAll,
    method: 'get',
    params,
  });
}

export function scoreTemplateList(params) {
  return request2({
    url: commonApi.ScoreTemplateList,
    method: 'get',
    params,
  });
}

export function expertList(params) {
  return request2({
    url: commonApi.ExpertList,
    method: 'get',
    params,
  });
}

export function productList(id) {
  return request2({
    url: commonApi.ProductList + id,
    method: 'get',
  });
}

export function skuList(id) {
  return request2({
    url: commonApi.SkuList + id,
    method: 'get',
  });
}

export function budgetList(params) {
  return request2({
    url: commonApi.BudgetList,
    method: 'get',
    params,
  });
}

export function budgetDetail(id) {
  return request2({
    url: commonApi.BudgetDetail + id,
    method: 'get',
  });
}

export function supplierList(params) {
  return request2({
    url: commonApi.SupplierList,
    method: 'get',
    params,
  });
}

export function contractList(params) {
  return request2({
    url: commonApi.ContractList,
    method: 'get',
    params,
  });
}

export function categoryAll(params) {
  return request2({
    url: commonApi.CategoryAll,
    method: 'get',
    params,
  });
}

// 字典类型键值对，每次调整或新增字典类型时需要调整
const dictTypeIdMap = {
  sex: '953980757942993160', // 性别
  companyType: '953979229270180472', // 企业性质
  country: '953980071297680204', // 国家
  creditRating: '953980217670500373', // 信用等级
  industryType: '953980481790018035', // 行业类型
  qualifiedSupplierRating: '957372349642965627', // 评级
  bidType: '958423698967101682', // 招标方式
  dept: '958440266736337907', // 所属单位
  professional: '958440739656696103', // 职称
  gradeType: '958759979588780795', // 评分类别
  gradePartType: '958794708409123681', // 评分要素类型
  unitType: '962722364854895037', // 单位
  deliverType: '962725779249037431', // 配送方式，
  reasonType: '966625617875304828', // 售后原因
  source: '965993203222184557', // 价格来源
};

/**
 *
 * @returns 性别字典数据
 */
export function getSexDict() {
  return dictList(dictTypeIdMap.sex);
}

/**
 *
 * @returns 企业性质字典数据
 */
export function getCompanyTypeDict() {
  return dictList(dictTypeIdMap.companyType);
}

/**
 *
 * @returns 国家字典数据
 */
export function getCountryDict() {
  return dictList(dictTypeIdMap.country);
}

/**
 *
 * @returns 信用等级字典数据
 */
export function getCreditRatingDict() {
  return dictList(dictTypeIdMap.creditRating);
}

/**
 *
 * @returns 行业类型字典数据
 */
export function getIndustryTypeDict() {
  return dictList(dictTypeIdMap.industryType);
}

/**
 *
 * @returns 评级字典数据
 */
export function getRatingDict() {
  return dictList(dictTypeIdMap.qualifiedSupplierRating);
}

/**
 *
 * @returns 招标方式字典数据
 */
export function getBidTypeDict() {
  return dictList(dictTypeIdMap.bidType);
}

/**
 *
 * @returns 所属单位字典数据
 */
export function getDeptDict() {
  return dictList(dictTypeIdMap.dept);
}

/**
 *
 * @returns 职称字典数据
 */
export function getProfessionalDict() {
  return dictList(dictTypeIdMap.professional);
}

/**
 *
 * @returns 评分类别字典数据
 */
export function getGradeTypeDict() {
  return dictList(dictTypeIdMap.gradeType);
}

/**
 *
 * @returns 评分要素类型字典数据
 */
export function getGradePartTypeDict() {
  return dictList(dictTypeIdMap.gradePartType);
}

/**
 *
 * @returns 单位字典数据
 */
export function getUnitDict() {
  return dictList(dictTypeIdMap.unitType);
}
/**
 * @returns 配送方式字典数据
 */
export function getDeliverTypeDict() {
  return dictList(dictTypeIdMap.deliverType);
}

/**
 * @returns 售后原因字典数据
 */
export function getReasonTypeDict() {
  return dictList(dictTypeIdMap.reasonType);
}

/**
 * @returns 价格来源字典数据
 */
export function getPriceSourceDict() {
  return dictList(dictTypeIdMap.source);
}
