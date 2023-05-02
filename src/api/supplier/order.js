import { request } from '@/utils/request';

const orderApi = {
  // 分页查询订单列表
  orderList: '/shqjcpt/supplier/order/page',
  // 查询招标详情
  orderDtail: '/shqjcpt/supplier/order/',
  // 新增订单竞价供应商
  orderAdd: '/shqjcpt/supplier/orderBidding',
  // 查询订单竞价供应商详情
  orderBiddingDetail: '/shqjcpt/supplier/orderBidding/',

  // 查询竞价订单可送货列表
  orderBiddingPage: '/shqjcpt/supplier/orderBidding/delivery/page',
  // 分页查询送货单列表
  orderDeliveryPage: '/shqjcpt/supplier/orderDelivery/page',
  // 新增送货单
  orderDeliveryAdd: '/shqjcpt/supplier/orderDelivery',

    // 分页查询竞价订单售后列表
    orderAfterSalesPage: '/shqjcpt/supplier/orderBiddingAfterSales/page',
    // 查询竞价订单售后详情
    orderAfterSalesDetail: '/shqjcpt/supplier/orderBiddingAfterSales/',
    // 新增竞价订单售后
    orderAfterSalesAdd: '/shqjcpt/supplier/orderBiddingAfterSales',
};

export function orderList(params) {
  return request({
    url: orderApi.orderList,
    method: 'get',
    params,
  });
}

export function orderDtail(id) {
  return request({
    url: orderApi.orderDtail + id,
    method: 'get',
  });
}

export function orderAdd(parameter) {
  return request({
    url: orderApi.orderAdd,
    method: 'post',
    data: parameter,
  });
}

export function orderBiddingDetail(id) {
  return request({
    url: orderApi.orderBiddingDetail + id,
    method: 'get',
  });
}

export function orderBiddingPage(params) {
  return request({
    url: orderApi.orderBiddingPage,
    method: 'get',
    params,
  });
}

export function orderDeliveryPage(params) {
  return request({
    url: orderApi.orderDeliveryPage,
    method: 'get',
    params,
  });
}

export function orderDeliveryAdd(parameter) {
  return request({
    url: orderApi.orderDeliveryAdd,
    method: 'post',
    data: parameter,
  });
}

export function orderAfterSalesPage(params) {
  return request({
    url: orderApi.orderAfterSalesPage,
    method: 'get',
    params,
  });
}

export function orderAfterSalesDetail(id) {
  return request({
    url: orderApi.orderAfterSalesDetail + id,
    method: 'get',
  });
}

export function orderAfterSalesAdd(parameter) {
  return request({
    url: orderApi.orderAfterSalesAdd,
    method: 'post',
    data: parameter,
  });
}
