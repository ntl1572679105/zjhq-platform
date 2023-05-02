export const supplierRouters = [
  {
    key: 'supplierProject',
    value: {
      name: 'supplierProject',
      path: '/supplierProject',
      component: () => import('@/layouts/BlankLayout.vue'),
      meta: {
        title: '项目中心',
        icon: 'IdcardOutlined',
      },
      children: [],
    },
  },
  {
    key: '/supplier/bidding-list',
    value: {
      name: 'supplier-bidding-list',
      path: '/supplier/bidding-list',
      component: () => import('@/views/Supplier/Bidding/List.vue'),
      meta: {
        title: '投标台',
      },
      children: [
        {
          name: 'supplier-bidding-detail',
          path: '/supplier/bidding-list/:id',
          component: () => import('@/views/Supplier/Bidding/Detail.vue'),
          meta: {
            title: '项目详情',
            hideInMenu: true,
            parentPath: '/supplier/bidding-list',
            parentTitle: '招投标项目管理',
          },
          props: true,
        },
        {
          name: 'supplier-bidding-add',
          path: '/supplier/bidding-list/add/:id',
          component: () => import('@/views/Supplier/Bidding/BidAdd.vue'),
          meta: {
            title: '投标单',
            hideInMenu: true,
            parentPath: '/supplier/bidding-list',
            parentTitle: '招投标项目管理',
          },
          props: true,
        },
      ],
    },
  },
  {
    key: '/supplier/order-list',
    value: {
      name: 'supplier-order-list',
      path: '/supplier/order-list',
      component: () => import('@/views/Supplier/Order/OrderList.vue'),
      meta: {
        title: '竞价台',
      },
      children: [
        {
          name: 'supplier-order-detail',
          path: '/supplier/order-list/:type/:id',
          component: () => import('@/views/Supplier/Order/OrderDetail.vue'),
          meta: {
            title: '竞价管理',
            hideInMenu: true,
            parentPath: '/supplier/order-list',
            parentTitle: '竞价台',
          },
          props: true,
        },
      ],
    },
  },
  {
    key: '/supplier/orderpurchase-list',
    value: {
      name: 'supplier-orderpurchase-list',
      path: '/supplier/orderpurchase-list',
      component: () => import('@/views/Supplier/Order/OrderPurchaseList.vue'),
      meta: {
        title: '采购订单管理',
      },
      children: [
        {
          name: 'supplier-orderpurchase-detail',
          path: '/supplier/orderpurchase-list/:type/:id',
          component: () => import('@/views/Supplier/Order/OrderPurchaseDetail.vue'),
          meta: {
            title: '采购订单详情',
            hideInMenu: true,
            parentPath: '/supplier/orderpurchase-list',
            parentTitle: '采购订单管理',
          },
          props: true,
        },
      ],
    },
  },
  {
    key: '/supplier/orderpurchase-after-list',
    value: {
      name: 'supplier-orderpurchase-after-list',
      path: '/supplier/orderpurchase-after-list',
      component: () => import('@/views/Supplier/Order/OrderAfterSalesList.vue'),
      meta: {
        title: '采购订单售后管理',
      },
    },
  },
];
