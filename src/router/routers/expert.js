export const expertRouters = [
    {
      key: '/expert/bidding-list',
      value: {
        name: 'expert-bidding-list',
        path: '/expert/bidding-list',
        component: () => import('@/views/Expert/Bidding/List.vue'),
        meta: {
          title: '评标列表',
        },
        children: [
          {
            name: 'expert-bidding-detail',
            path: '/expert/bidding-list/:type/:id',
            component: () => import('@/views/Expert/Bidding/Detail.vue'),
            meta: {
              title: '评标详情',
              hideInMenu: true,
              parentPath: '/expert/bidding-list',
              parentTitle: '评标列表',
            },
            props: true,
          },
        ],
      },
    },
  ];
  