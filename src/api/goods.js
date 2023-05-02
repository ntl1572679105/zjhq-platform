import { request } from "@/utils/request";

const goodsApi = {
  // 分页查询商品列表
  list: '/shqjcpt/operator/product/page',
  // 查询商品详情
  detail: '/shqjcpt/operator/product/',
  // 新增商品
  add: '/shqjcpt/operator/product',
  // 删除商品
  delete: '/shqjcpt/operator/product/',
  // 修改商品
  update: '/shqjcpt/operator/product',
  // 分页查询商品比价列表
  compareList: '/shqjcpt/operator/productCompare/page',
  // 修改商品比价
  updateProductCompare: '/shqjcpt/operator/productCompare',
  // 新增商品比价
  addProductCompare: '/shqjcpt/operator/productCompare',
  // 删除商品比价
  deleteProductCompare: '/shqjcpt/operator/productCompare/',
  // 根据sku商品列表
  productsBySku: '/shqjcpt/common/product/bySku/',
  // 根据类目商品列表
  productsByCategory: '/shqjcpt/common/product/byCategory',
  // 查询商品比价详情
  compareDetail: '/shqjcpt/operator/productCompare/info',
  // 导入商品
  importGoods: '/shqjcpt/operator/product/import',
}

export function GoodsList(params) {
  return request({
    url: goodsApi.list,
    method: 'get',
    params
  })
}

export function GoodsDetail(id) {
  return request({
    url: goodsApi.detail + id,
    method: 'get',
  })
}

export function AddGoods(parameter) {
  return request({
    url: goodsApi.add,
    method: 'post',
    data: parameter
  })
}

export function DelGoods(id) {
  return request({
    url: goodsApi.delete + id,
    method: 'delete',
  })
}

export function UpdateGoods(parameter) {
  return request({
    url: goodsApi.update,
    method: 'put',
    data: parameter
  })
}

export function CompareList(params) {
  return request({
    url: goodsApi.compareList,
    method: 'get',
    params
  });
}

export function addProductCompare(parameter) {
  return request({
    url: goodsApi.addProductCompare,
    method: 'post',
    data: parameter
  });
}

export function deleteProductCompare(id) {
  return request({
    url: goodsApi.deleteProductCompare + id,
    method: 'delete',
  });
}

export function updateProductCompare(parameter) {
  return request({
    url: goodsApi.updateProductCompare,
    method: 'put',
    data: parameter
  });
}

export function compareDetailList(params) {
  return request({
    url: goodsApi.compareDetail,
    method: 'get',
    params
  });
}
export function productsBySku(skuId) {
  return request({
    url: goodsApi.productsBySku + skuId,
    method: 'get',
  });
}

export function productsByCategory(params) {
  return request({
    url: goodsApi.productsByCategory,
    method: 'get',
    params
  });
}

export function importGoods(parameter) {
  return request({
    url: goodsApi.importGoods,
    method: 'post',
    data: parameter,
  });
}