import * as loginService from '@/api/login';
import { supplierRouters } from './routers/supplier';
import { expertRouters } from './routers/expert';

// 根据接口返回的path映射路由
const menuMap = new Map();
// key: 为返回菜单的path，value: 对应的组件页面及子页面

/// 前端本地映射路由
// 菜单管理列表
menuMap.set('system', {
  name: 'system',
  path: '/system',
  component: () => import('@/layouts/BlankLayout.vue'),
  meta: {
    title: 'menu.system',
    icon: 'MailOutlined',
  },
  children: [],
});
menuMap.set(`/system/menu-list`, {
  name: 'menu-list',
  path: '/system/menu-list',
  component: () => import('@/views/system/MenuList.vue'),
  meta: {
    title: 'menu.system.menuManagement',
  },
});
// 角色管理列表
menuMap.set(`/system/role-list`, {
  name: 'role-list',
  path: '/system/role-list',
  component: () => import('@/views/system/RoleList.vue'),
  meta: {
    title: 'menu.rolemanagement',
  },
});
// 管理员管理列表
menuMap.set(`/system/admin-list`, {
  name: 'admin-list',
  path: '/system/admin-list',
  component: () => import('@/views/system/AdminList.vue'),
  meta: {
    title: 'menu.system.admin',
  },
});
/// 日志管理
menuMap.set('log-list', {
  name: 'logManage',
  path: '/system/log',
  component: () => import('@/layouts/BlankLayout.vue'),
  meta: {
    title: '日志管理',
  },
  children: [],
});
menuMap.set(`log-operation-list`, {
  name: 'operationLogManage',
  path: '/system/log/operation',
  component: () => import('@/views/system/OperateList.vue'),
  meta: {
    title: '操作日志',
  },
});
menuMap.set(`log-login-list`, {
  name: 'loginLogManage',
  path: '/system/log/login',
  component: () => import('@/views/system/LoginList.vue'),
  meta: {
    title: '登录日志',
  },
});

menuMap.set(`/system/dept-list`, {
  name: 'deptManage',
  path: '/system/dept-list',
  component: () => import('@/views/system/DeptList.vue'),
  meta: {
    title: '部门管理',
  },
});

menuMap.set(`/system/config-list`, {
  name: 'configManage',
  path: '/system/config-list',
  component: () => import('@/views/system/ConfigList.vue'),
  meta: {
    title: '配置管理',
  },
});

menuMap.set('/system/infomation-list', {
  name: 'infomation',
  path: '/system/infomation-list',
  component: () => import('@/views/system/InfomationList.vue'),
  meta: {
    title: '资讯管理',
  },
});

menuMap.set('/system/dict-list', {
  name: 'dictManage',
  path: '/system/dict-list',
  component: () => import('@/views/system/DictTypeList.vue'),
  meta: {
    title: '字典管理',
  },
  children: [
    {
      name: 'dictDataManage',
      path: '/system/dict-list/:id',
      component: () => import('@/views/system/DictDataList.vue'),
      meta: {
        title: '自带类型详情',
        hideInMenu: true,
        parentPath: '/system/dict-list',
        parentTitle: '字典管理',
      },
      props: true,
    },
  ],
});

menuMap.set(`/system/flow-list`, {
  name: 'flowManage',
  path: '/system/flow-list',
  component: () => import('@/views/flow/List.vue'),
  meta: {
    title: '流程管理',
  },
  children: [
    {
      name: 'flowDesignManage',
      path: '/system/flow-list/:id',
      component: () => import('@/views/flow/Design.vue'),
      meta: {
        title: '流程设计',
        hideInMenu: true,
        parentPath: '/system/flow-list',
        parentTitle: '流程管理',
      },
      props: true,
    },
  ],
});

// 采购首页
menuMap.set('purchasingHome', {
  name: 'purchasingHome',
  path: '/purchasingHome',
  component: () => import('@/views/SupplierChain/Home/index.vue'),
  meta: {
    title: '采购首页',
    hiddenHeaderContent: true,
    icon: 'HomeOutlined',
  },
});
// 供应商管理
menuMap.set('purchasingSupplierManage', {
  name: 'purchasingSupplierManage',
  path: '/purchasingSupplierManage',
  component: () => import('@/layouts/BlankLayout.vue'),
  meta: {
    title: '供应商管理',
    icon: 'IdcardOutlined',
  },
  children: [],
});
menuMap.set('purchasingSupplier', {
  name: 'purchasingSupplier',
  path: '/purchasingSupplier',
  component: () => import('@/views/Purchaser/Supplier/List.vue'),
  meta: {
    title: '供应商资质审核',
  },
  children: [
    {
      name: 'purchasingSupplierAdd',
      path: '/purchaser/supplier/add',
      component: () => import('@/views/Purchaser/Supplier/Detail.vue'),
      meta: {
        title: '供应商准入',
        hiddenHeaderContent: true,
        hideInMenu: true,
        parentPath: '/purchasingSupplier',
        parentTitle: '供应商管理',
      },
    },
    {
      name: 'purchasingSupplierDetail',
      path: '/purchaser/supplier/:type/:id',
      component: () => import('@/views/Purchaser/Supplier/Detail.vue'),
      meta: {
        title: '供应商详情',
        hiddenHeaderContent: true,
        hideInMenu: true,
        parentPath: '/purchasingSupplier',
        parentTitle: '供应商管理',
      },
      props: true,
    },
    {
      name: 'supplierInvitationList',
      path: '/purchaser/supplier/InvitationList',
      component: () => import('@/views/Purchaser/Supplier/InvitationList.vue'),
      meta: {
        title: '供应商邀请列表',
        hiddenHeaderContent: true,
        hideInMenu: true,
        parentPath: '/purchasingSupplier',
        parentTitle: '供应商管理',
      },
      props: true,
    },
  ],
});
menuMap.set('qualifiedSupplier', {
  name: 'qualifiedSupplier',
  path: '/qualifiedSupplier',
  component: () => import('@/views/Purchaser/QualifiedSupplier/List.vue'),
  meta: {
    title: '合格供应商管理',
  },
  children: [
    {
      name: 'qualifiedSupplierDetail',
      path: '/qualifiedSupplierDetail/:type/:id',
      component: () => import('@/views/Purchaser/QualifiedSupplier/Detail.vue'),
      meta: {
        title: '合格供应商详情',
        hiddenHeaderContent: true,
        hideInMenu: true,
        parentPath: '/qualifiedSupplier',
        parentTitle: '供应商管理',
      },
      props: true,
    },
  ],
});
// 需求管理
menuMap.set('purchasingDemand', {
  name: 'purchasingDemand',
  path: 'purchasingDemand',
  component: () => import('@/layouts/BlankLayout.vue'),
  meta: {
    title: '需求管理',
    icon: 'CopyOutlined',
  },
});
menuMap.set(`/purchasingManagement/category-list`, {
  name: 'purchasing-category-list',
  path: '/purchasingManagement/category-list',
  component: () => import('@/views/Purchaser/Demand/CategoryList.vue'),
  meta: {
    title: '品类管理',
  },
});
menuMap.set(`/purchasingManagement/goods-list`, {
  name: 'purchasing-goods-list',
  path: '/purchasingManagement/goods-list',
  component: () => import('@/views/Purchaser/Demand/Goods.vue'),
  meta: {
    title: '需求商城管理',
  },
  children: [
    {
      name: 'purchasing-demand-add',
      path: '/purchasingManagement/demand-add',
      component: () => import('@/views/Purchaser/Demand/Detail.vue'),
      meta: {
        title: '新建需求',
        hideInMenu: true,
        parentPath: '/purchasingManagement/goods-list',
        parentTitle: '需求商城管理',
      },
    },
  ],
});
menuMap.set(`/purchasingManagement/demand-list`, {
  name: 'purchasing-demand-list',
  path: '/purchasingManagement/demand-list',
  component: () => import('@/views/Purchaser/Demand/List.vue'),
  meta: {
    title: '采购需求管理',
  },
  children: [
    {
      name: 'purchasing-demand-detail',
      path: '/purchasingManagement/demand-list/:type/:id',
      component: () => import('@/views/Purchaser/Demand/Detail.vue'),
      meta: {
        title: '需求详情',
        hideInMenu: true,
        parentPath: '/purchasingManagement/demand-list',
        parentTitle: '采购需求管理',
      },
      props: true,
    },
  ],
});
menuMap.set(`/purchasingManagement/assign-list`, {
  name: 'purchasing-assign-list',
  path: '/purchasingManagement/assign-list',
  component: () => import('@/views/Purchaser/Demand/AssignList.vue'),
  meta: {
    title: '采购需求分配管理',
  },
  children: [
    {
      name: 'purchasing-assign-detail',
      path: '/purchasingManagement/assign-list/:type/:id',
      component: () => import('@/views/Purchaser/Demand/Detail.vue'),
      meta: {
        title: '需求详情',
        hideInMenu: true,
        parentPath: '/purchasingManagement/assign-list',
        parentTitle: '采购需求分配管理',
      },
      props: true,
    },
  ],
});
menuMap.set(`/purchasingManagement/assign-deal-list`, {
  name: 'purchasing-assign-deal-list',
  path: '/purchasingManagement/assign-deal-list',
  component: () => import('@/views/Purchaser/Demand/DealList.vue'),
  meta: {
    title: '采购需求处理管理',
  },
  children: [
    {
      name: 'purchasing-assign-deal-detail',
      path: '/purchasingManagement/assign-deal-list/:type/:id',
      component: () => import('@/views/Purchaser/Demand/Detail.vue'),
      meta: {
        title: '需求详情',
        hideInMenu: true,
        parentPath: '/purchasingManagement/assign-deal-list',
        parentTitle: '采购需求处理管理',
      },
      props: true,
    },
  ],
});
menuMap.set(`/purchasingManagement/project-list`, {
  name: 'purchasing-project-list',
  path: '/purchasingManagement/project-list',
  component: () => import('@/views/Purchaser/Demand/ProjectList.vue'),
  meta: {
    title: '采购项目管理',
  },
  children: [
    {
      name: 'purchasing-project-detail',
      path: '/purchasingManagement/project-list/:type/:id',
      component: () => import('@/views/Purchaser/Demand/ProjectDetail.vue'),
      meta: {
        title: '项目详情',
        hideInMenu: true,
        parentPath: '/purchasingManagement/project-list',
        parentTitle: '采购项目管理',
      },
      props: true,
    },
    {
      name: 'purchasing-project-add',
      path: '/purchasingManagement/project-list/add',
      component: () => import('@/views/Purchaser/Demand/ProjectDetail.vue'),
      meta: {
        title: '新建项目',
        hideInMenu: true,
        parentPath: '/purchasingManagement/project-list',
        parentTitle: '采购项目管理',
      },
    },
  ],
});

/// 商品中心
menuMap.set('goodsManage', {
  name: 'goods-Manage',
  path: '/goodsManage',
  component: () => import('@/layouts/BlankLayout.vue'),
  meta: {
    title: '商品管理',
    icon: 'MailOutlined',
  },
  children: [],
});

// 商品比价
menuMap.set('/goodsManage/productCompare', {
  name: 'productCompare',
  path: '/goodsManage/productCompare',
  component: () => import('@/views/Purchaser/Goods/ProductCompare.vue'),
  meta: {
    title: '商品比价',
    hiddenHeaderContent: true,
  },
  children: []
})

menuMap.set('/goodsManage/recomment-list', {
  name: 'goods-recomment-list',
  path: '/goodsManage/recomment-list',
  component: () => import('@/views/Purchaser/Goods/RecommendList.vue'),
  meta: {
    title: '热门推荐',
    hiddenHeaderContent: true,
  },
});
menuMap.set('/goodsManage/brand-list', {
  name: 'goods-brand-list',
  path: '/goodsManage/brand-list',
  component: () => import('@/views/Purchaser/Goods/BrandRecommendList.vue'),
  meta: {
    title: '品牌促销',
    hiddenHeaderContent: true,
  },
});

// 商品中心管理
menuMap.set('/goodsManage/goods-list', {
  name: 'goods-list',
  path: '/goodsManage/goods-list',
  component: () => import('@/views/Purchaser/Goods/GoodsManage.vue'),
  meta: {
    title: '商品中心管理',
    hiddenHeaderContent: true,
  },
  children: [
    {
      name: 'goods-list-add',
      path: '/goodsManage/goods-list/add',
      component: () => import('@/views/Purchaser/Goods/GoodsDetail.vue'),
      meta: {
        title: '新增商品',
        hideInMenu: true,
        parentPath: '/goodsManage/goods-list',
        parentTitle: '商品中心管理',
      },
    },
    {
      name: 'goods-list-detail',
      path: '/goodsManage/good-detail/:type/:id',
      component: () => import('@/views/Purchaser/Goods/GoodsDetail.vue'),
      meta: {
        title: '商品详情',
        hideInMenu: true,
        parentPath: '/goodsManage/goods-list',
        parentTitle: '商品中心管理',
      },
      props: true,
    },
  ],
});

/// 采购管理
menuMap.set('purchasingManagement', {
  name: 'purchasingManagement',
  path: '/purchasingManagement',
  component: () => import('@/layouts/BlankLayout.vue'),
  meta: {
    title: '采购管理',
    icon: 'MailOutlined',
  },
  children: [],
});
menuMap.set(`/purchasingManagement/order-list`, {
  name: 'purchasing-order-list',
  path: '/purchasingManagement/order-list',
  component: () => import('@/views/Purchaser/Purchases/OrderList.vue'),
  meta: {
    title: '采购订单管理',
  },
  children: [
    {
      name: 'purchasing-order-detail',
      path: '/purchasingManagement/order-list/:type/:id',
      component: () => import('@/views/Purchaser/Purchases/OrderDetail.vue'),
      meta: {
        title: '订单详情',
        hideInMenu: true,
        parentPath: '/purchasingManagement/order-list',
        parentTitle: '采购订单管理',
      },
      props: true,
    },
    {
      name: 'purchasing-order-add',
      path: '/purchasingManagement/order-list/add',
      component: () => import('@/views/Purchaser/Purchases/OrderDetail.vue'),
      meta: {
        title: '新建订单',
        hideInMenu: true,
        parentPath: '/purchasingManagement/order-list',
        parentTitle: '采购订单管理',
      },
    },
    {
      name: 'purchasing-order-bid',
      path: '/purchasingManagement/order-list/bid/:type/:id',
      component: () => import('@/views/Purchaser/Purchases/OrderBidDetail.vue'),
      meta: {
        title: '采购订单竞价',
        hideInMenu: true,
        parentPath: '/purchasingManagement/order-list',
        parentTitle: '采购订单管理',
      },
      props: true,
    },
  ],
});
menuMap.set(`/purchasingManagement/orderbid-list`, {
  name: 'purchasing-order-bid-list',
  path: '/purchasingManagement/orderbid-list',
  component: () => import('@/views/Purchaser/Purchases/OrderBiddingList.vue'),
  meta: {
    title: '采购订单竞价管理',
  },
  children: [
    {
      name: 'purchasing-order-bid-detail',
      path: '/purchasingManagement/orderbid-list/:type/:id',
      component: () => import('@/views/Purchaser/Purchases/OrderBidDetail.vue'),
      meta: {
        title: '订单详情',
        hideInMenu: true,
        parentPath: '/purchasingManagement/orderbid-list',
        parentTitle: '采购订单竞价管理',
      },
      props: true,
    },
    {
      name: 'purchasing-order-bid-select',
      path: '/purchasingManagement/orderbid-list/:id',
      component: () => import('@/views/Purchaser/Purchases/OrderBiddingDetail.vue'),
      meta: {
        title: '采购订单竞价',
        hideInMenu: true,
        parentPath: '/purchasingManagement/orderbid-list',
        parentTitle: '采购订单竞价管理',
      },
      props: true,
    },
    {
      name: 'purchasing-order-bid-new',
      path: '/purchasingManagement/order-bid-list/:type/:id',
      component: () => import('@/views/Purchaser/Purchases/OrderBidDetail.vue'),
      meta: {
        title: '采购订单竞价',
        hideInMenu: true,
        parentPath: '/purchasingManagement/orderbid-list',
        parentTitle: '采购订单竞价管理',
      },
      props: true,
    },
  ],
});

menuMap.set(`/purchasingManagement/receive-list`, {
  name: 'purchasing-receive-list',
  path: '/purchasingManagement/receive-list',
  component: () => import('@/views/Purchaser/Purchases/OrderReceiveList.vue'),
  meta: {
    title: '采购订单收货管理',
  },
  children: [
    {
      name: 'purchasing-order-receive',
      path: '/purchasingManagement/order-list/receive/:type/:id',
      component: () => import('@/views/Purchaser/Purchases/OrderReceiveDetail.vue'),
      meta: {
        title: '采购订单详情',
        hideInMenu: true,
        parentPath: '/purchasingManagement/receive-list',
        parentTitle: '采购订单收货管理',
      },
      props: true,
    },
  ],
});

menuMap.set(`/purchasingManagement/aftersales-list`, {
  name: 'purchasing-aftersales-list',
  path: '/purchasingManagement/aftersales-list',
  component: () => import('@/views/Purchaser/Purchases/AfterSalesList.vue'),
  meta: {
    title: '采购订单售后',
  },
});

/// 招投标管理
menuMap.set('purchasingBidding', {
  name: 'purchasingBidding',
  path: '/purchasingBidding',
  component: () => import('@/layouts/BlankLayout.vue'),
  meta: {
    title: '招投标管理',
    icon: 'IdcardOutlined',
  },
  children: [],
});

menuMap.set(`/purchasingBidding/bidding-list`, {
  name: 'purchasing-bidding-list',
  path: '/purchasingBidding/bidding-list',
  component: () => import('@/views/Purchaser/Bidding/List.vue'),
  meta: {
    title: '招投标项目管理',
  },
  children: [
    {
      name: 'purchasing-bidding-detail',
      path: '/purchasingManagement/bidding-list/:type/:id',
      component: () => import('@/views/Purchaser/Bidding/Detail.vue'),
      meta: {
        title: '项目详情',
        hideInMenu: true,
        parentPath: '/purchasingBidding/bidding-list',
        parentTitle: '招投标项目管理',
      },
      props: true,
    },
    {
      name: 'purchasing-bidding-process-detail',
      path: '/purchasingManagement/bidding-list/process/:id',
      component: () => import('@/views/Purchaser/Bidding/ProcessDetail.vue'),
      meta: {
        title: '招标详情',
        hideInMenu: true,
        parentPath: '/purchasingBidding/bidding-list',
        parentTitle: '招投标项目管理',
      },
      props: true,
    },
    {
      name: 'purchasing-bidding-add',
      path: '/purchasingManagement/bidding-list/add',
      component: () => import('@/views/Purchaser/Bidding/Detail.vue'),
      meta: {
        title: '新建招标',
        hideInMenu: true,
        parentPath: '/purchasingBidding/bidding-list',
        parentTitle: '招投标项目管理',
      },
    },
    {
      name: 'purchasing-bidding-demand',
      path: '/purchasingManagement/bidding-demand-list',
      component: () => import('@/views/Purchaser/Bidding/DemandList.vue'),
      meta: {
        title: '需求列表',
        hideInMenu: true,
        parentPath: '/purchasingBidding/bidding-list',
        parentTitle: '招投标项目管理',
      },
    },
    {
      name: 'purchasing-bidding-project',
      path: '/purchasingManagement/bidding-project-list',
      component: () => import('@/views/Purchaser/Bidding/ProjectList.vue'),
      meta: {
        title: '项目列表',
        hideInMenu: true,
        parentPath: '/purchasingBidding/bidding-list',
        parentTitle: '招投标项目管理',
      },
    },
  ],
});

menuMap.set('/purchasingBidding/expert-list', {
  name: 'purchasing-expert-list',
  path: '/purchasingBidding/expert-list',
  component: () => import('@/views/Purchaser/Bidding/ExpertList.vue'),
  meta: {
    title: '专家管理',
  },
  children: [
    {
      name: 'purchasing-expert-add',
      path: '/purchasingBidding/expert-list/add',
      component: () => import('@/views/Purchaser/Bidding/ExpertDetail.vue'),
      meta: {
        title: '新建专家',
        hiddenHeaderContent: true,
        hideInMenu: true,
        parentPath: '/purchasingBidding/expert-list',
        parentTitle: '专家管理',
      },
    },
    {
      name: 'purchasing-expert-detail',
      path: '/purchasingBidding/expert-list/:id',
      component: () => import('@/views/Purchaser/Bidding/ExpertDetail.vue'),
      meta: {
        title: '专家详情',
        hiddenHeaderContent: true,
        hideInMenu: true,
        parentPath: '/purchasingBidding/expert-list',
        parentTitle: '专家管理',
      },
      props: true,
    },
  ],
});

// 机构管理
menuMap.set('purchasingAgent', {
  name: 'purchasingAgent',
  path: '/operator/agent-list',
  component: () => import('@/views/Purchaser/Agent/List.vue'),
  meta: {
    title: '机构管理',
    hiddenHeaderContent: true,
  },
  children: [
    {
      name: 'purchasingAgentAdd',
      path: '/operator/agent/add',
      component: () => import('@/views/Purchaser/Agent/Detail.vue'),
      meta: {
        title: '新建机构',
        hiddenHeaderContent: true,
        hideInMenu: true,
        parentPath: '/operator/agent-list',
        parentTitle: '机构管理',
      },
    },
    {
      name: 'purchasingAgentDetail',
      path: '/operator/agent/:id',
      component: () => import('@/views/Purchaser/Agent/Detail.vue'),
      meta: {
        title: '机构详情',
        hiddenHeaderContent: true,
        hideInMenu: true,
        parentPath: '/operator/agent-list',
        parentTitle: '机构管理',
      },
      props: true,
    },
  ],
});

menuMap.set('/purchasingBidding/template-list', {
  name: 'purchasing-template-list',
  path: '/purchasingBidding/template-list',
  component: () => import('@/views/Purchaser/Bidding/ScoreTemplateList.vue'),
  meta: {
    title: '评分模板',
  },
  children: [
    {
      name: 'purchasing-template-add',
      path: '/purchasingBidding/template-list/add',
      component: () => import('@/views/Purchaser/Bidding/ScoreTemplateDetail.vue'),
      meta: {
        title: '新建模板',
        hiddenHeaderContent: true,
        hideInMenu: true,
        parentPath: '/purchasingBidding/template-list',
        parentTitle: '评分模板',
      },
    },
    {
      name: 'purchasing-template-detail',
      path: '/purchasingBidding/template-list/:type/:id',
      component: () => import('@/views/Purchaser/Bidding/ScoreTemplateDetail.vue'),
      meta: {
        title: '模板详情',
        hiddenHeaderContent: true,
        hideInMenu: true,
        parentPath: '/purchasingBidding/template-list',
        parentTitle: '评分模板',
      },
      props: true,
    },
  ],
});

menuMap.set(`/system/budget-list`, {
  name: 'system-budget-list',
  path: '/system/budget-list',
  component: () => import('@/views/Purchaser/Demand/BudgetList.vue'),
  meta: {
    title: '预算管理',
  },
});

/// 合同管理
menuMap.set('purchasingContract', {
  name: 'purchasingContract',
  path: '/purchasingContract',
  component: () => import('@/layouts/BlankLayout.vue'),
  meta: {
    title: '合同协议管理',
    icon: 'IdcardOutlined',
  },
  children: [],
});

menuMap.set(`/purchasing/contract-list`, {
  name: 'purchasing-contract-list',
  path: '/purchasing/contract-list',
  component: () => import('@/views/Purchaser/Contract/List.vue'),
  meta: {
    title: '合同管理',
  },
  children: [
    {
      name: 'purchasing-contract-detail',
      path: '/purchasing/contract-list/:type/:number/:id',
      component: () => import('@/views/Purchaser/Contract/Detail.vue'),
      meta: {
        title: '合同详情',
        hideInMenu: true,
        parentPath: '/purchasing/contract-list',
        parentTitle: '合同管理',
      },
      props: true,
    },
    {
      name: 'purchasing-contract-add',
      path: '/purchasing/contract-list/:type/add',
      component: () => import('@/views/Purchaser/Contract/Detail.vue'),
      meta: {
        title: '上传合同',
        hideInMenu: true,
        parentPath: '/purchasing/contract-list',
        parentTitle: '合同管理',
      },
      props: true,
    },
  ],
});

menuMap.set(`/purchasing/contract-category-list`, {
  name: 'purchasing-contract-category-list',
  path: '/purchasing/contract-category-list',
  component: () => import('@/views/Purchaser/Contract/CategoryList.vue'),
  meta: {
    title: '合同协议管理',
  },
});

menuMap.set(`/purchasing/integrityContract-list`, {
  name: 'purchasing-integrityContract-list',
  path: '/purchasing/integrityContract-list',
  component: () => import('@/views/Purchaser/Contract/IntegrityContractList.vue'),
  meta: {
    title: '廉政合约管理',
  },
  children: [
    {
      name: 'purchasing-integrityContract-detail',
      path: '/purchasing/integrityContract-list/:type/:number/:id',
      component: () => import('@/views/Purchaser/Contract/Detail.vue'),
      meta: {
        title: '廉政公约详情',
        hideInMenu: true,
        parentPath: '/purchasing/integrityContract-list',
        parentTitle: '廉政合约管理',
      },
      props: true,
    },
    {
      name: 'purchasing-integrityContract-add',
      path: '/purchasing/integrityContract-list/:type/add',
      component: () => import('@/views/Purchaser/Contract/Detail.vue'),
      meta: {
        title: '新增廉政公约',
        hideInMenu: true,
        parentPath: '/purchasing/integrityContract-list',
        parentTitle: '廉政合约管理',
      },
      props: true,
    },
  ],
});

/// 供应商路由
supplierRouters.forEach((router) => {
  menuMap.set(router.key, router.value);
});

// 专家路由
expertRouters.forEach((router) => {
  menuMap.set(router.key, router.value);
});

// 前端未找到页面路由（固定不用改）
const notFoundRouter = {
  path: '/:pathMatch(.*)*',
  name: 'NotFound',
  component: () => import('@/views/exception/404.vue'),
};

// 根级菜单
const rootRouter = {
  name: 'rootRouterIndex',
  path: '/',
  component: () => import('@/layouts/BasicLayout.vue'),
  meta: {
    title: '',
    hiddenHeaderContent: true,
  },
  children: [],
};

/**
 * 动态生成菜单
 * @returns {Promise<Router>}
 */
export const generatorDynamicRouter = () => {
  return new Promise((resolve, reject) => {
    loginService.getCurrentUserNav().then((res) => {
      console.log('generatorDynamicRouter response:', res);
      const menuNav = [];
      const childrenNav = [];
      listMapList(res, childrenNav);
      // 后端直接返回树形菜单
      rootRouter.children = childrenNav;
      // debugger
      console.log(childrenNav[0].path, 'childrenNav[0].path');
      rootRouter.redirect = childrenNav[0].path;
      menuNav.push(rootRouter);
      menuNav.push(notFoundRouter);
      console.log('menuNav', menuNav);
      resolve(menuNav);
    });
  });
};

/**
 * 数组遍历转换为菜单数组
 * @param {*} list 源数组
 * @param {*} result 结果
 * @param {*} parent 数节点
 */
const listMapList = (list, result, parent) => {
  list.forEach((item) => {
    // isFrame : 是否为外链 0-是 1-否
    // menuId: 菜单id
    // remark: 菜单名称
    // menuType: M-目录 C-菜单 F-按钮
    // path: 地址
    // perms: 权限字符串
    // status: 菜单状态 0-正常 1-停用
    // visible: 显示状态 0-显示 1-隐藏
    if (item.menuType === 'M' || item.menuType === 'C') {
      const child = {
        name: `${item.path}`,
        meta: {
          title: item.remark,
          menuType: item.menuType,
          hiddenHeaderContent: true,
          hideInMenu: item.visible === 1,
        },
        children: [],
      };
      // 子节点提升list
      let leafList = [];
      if (menuMap.get(item.path)) {
        // 判断是否有菜单
        const localMenu = menuMap.get(item.path);
        child.path = localMenu.path;
        child.component = localMenu.component;
        child.meta.icon = localMenu.meta?.icon;
        // 是否有详情和其他操作页面，若有则将子页面提升到同一级
        localMenu.children &&
          (leafList = localMenu.children.map((element) => {
            const { meta } = element;
            meta.hiddenHeaderContent = true;
            meta.hideInMenu = true;
            meta.parentPath = child.path;
            meta.parentTitle = child.meta.title;
            return { ...element, meta };
          }));
      } else if (item.menuType === 'M') {
        child.path = `${child.name}`;
        child.component = () => import('@/layouts/BlankLayout.vue');
      } else {
        child.path = `/${child.name}`;
        child.component = () => import('@/views/exception/404.vue');
      }
      // todo
      // if (item.isFrame === 1) {
      //   child.component = () => import('@/views/iframe/index.vue');
      // }

      // 迭代子树
      item.children && listMapList(item.children, child.children, child);
      if (child.children.length <= 0) {
        delete child.children;
      } else {
        child.redirect = child.children[0].path;
      }
      // console.log(child.component,'child.component');
      result.push(child, ...leafList);
    }
  });
};
