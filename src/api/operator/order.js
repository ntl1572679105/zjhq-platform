import { request2 } from '@/utils/request';

const orderApi = {
  // 分页查询订单列表
  orderPage: '/shqjcpt/operator/order/page',
  // 查询订单详情
  orderDetail: '/shqjcpt/operator/order/',
  // 新增订单
  orderAdd: '/shqjcpt/operator/order',
  // 修改订单
  orderEdit: '/shqjcpt/operator/order',
  // 删除订单
  orderDelete: '/shqjcpt/operator/order/',
  // 新增竞价订单
  orderBidAdd: '/shqjcpt/operator/order/addBid',
  // 订单审核
  orderApproval: '/shqjcpt/operator/order/approvalAudit',
  // 订单重开入围审核
  orderRepeat: '/shqjcpt/operator/order/repeatApproval/',

  // 分页查询可竞价订单列表
  orderBidPage: '/shqjcpt/operator/order/bidPage',
  // 分页查询订单竞价供应商列表
  orderBidSupplierPage: '/shqjcpt/operator/orderBidding/page',
  // 选取竞价订单
  orderBidding: '/shqjcpt/operator/orderBidding',

  // 查询竞价订单可收货列表
  orderReceivePage: '/shqjcpt/operator/orderBidding/receive/page',
  // 查询竞价订单详情
  orderBiddingDetail:'/shqjcpt/operator/orderBidding/',
  // 分页查询送货单列表
  orderReceiveList: '/shqjcpt/operator/orderReceive/page',
  // 收货
  receiveOrder: '/shqjcpt/operator/orderReceive/receive',

  // 分页查询竞价订单售后列表
  orderAfterSalesPage: '/shqjcpt/orderBiddingAfterSales/page',
  // 查询竞价订单售后详情
  orderAfterSalesDetail: '/shqjcpt/orderBiddingAfterSales/',
  // 新增竞价订单售后
  orderAfterSalesAdd: '/shqjcpt/orderBiddingAfterSales',
  // 处理竞价订单售后
  orderAfterSalesEdit: '/shqjcpt/orderBiddingAfterSales',
  // 删除竞价订单售后
  orderAfterSalesDelete: '/shqjcpt/orderBiddingAfterSales/',
};

export function orderPage(params) {
  return request2({
    url: orderApi.orderPage,
    method: 'get',
    params,
  });
}

export function orderDetail(id) {
  return request2({
    url: orderApi.orderDetail + id,
    method: 'get',
  });
}

export function orderAdd(parameter) {
  return request2({
    url: orderApi.orderAdd,
    method: 'post',
    data: parameter,
  });
}

export function orderEdit(parameter) {
  return request2({
    url: orderApi.orderEdit,
    method: 'put',
    data: parameter,
  });
}
export function orderDelete(id) {
  return request2({
    url: orderApi.orderDelete + id,
    method: 'delete',
  });
}

export function orderBidAdd(parameter) {
  return request2({
    url: orderApi.orderBidAdd,
    method: 'post',
    data: parameter,
  });
}

export function orderApproval(parameter) {
  return request2({
    url: orderApi.orderApproval,
    method: 'post',
    data: parameter,
  });
}

export function orderRepeat(id) {
  return request2({
    url: orderApi.orderRepeat + id,
    method: 'post',
  });
}

export function orderBidPage(params) {
  return request2({
    url: orderApi.orderBidPage,
    method: 'get',
    params,
  });
}

export function orderBidSupplierPage(params) {
  return request2({
    url: orderApi.orderBidSupplierPage,
    method: 'get',
    params,
  });
}

export function orderBidding(parameter) {
  return request2({
    url: orderApi.orderBidding,
    method: 'put',
    data: parameter,
  });
}

export function orderReceivePage(params) {
  return request2({
    url: orderApi.orderReceivePage,
    method: 'get',
    params,
  });
}

export function orderReceiveList(params) {
  return request2({
    url: orderApi.orderReceiveList,
    method: 'get',
    params,
  });
}

export function receiveOrder(parameter) {
  return request2({
    url: orderApi.receiveOrder,
    method: 'put',
    data: parameter,
  });
}

export function orderBiddingDetail(id) {
  return request2({
    url: orderApi.orderBiddingDetail + id,
    method: 'get',
  });
}

export function orderAfterSalesPage(params) {
  return request2({
    url: orderApi.orderAfterSalesPage,
    method: 'get',
    params,
  });
}

export function orderAfterSalesDetail(id) {
  return request2({
    url: orderApi.orderAfterSalesDetail + id,
    method: 'get',
  });
}

export function orderAfterSalesAdd(parameter) {
  return request2({
    url: orderApi.orderAfterSalesAdd,
    method: 'post',
    data: parameter,
  });
}

export function orderAfterSalesEdit(parameter) {
  return request2({
    url: orderApi.orderAfterSalesEdit,
    method: 'put',
    data: parameter,
  });
}
export function orderAfterSalesDelete(id) {
  return request2({
    url: orderApi.orderAfterSalesDelete + id,
    method: 'delete',
  });
}
