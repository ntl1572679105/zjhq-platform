const RouteView = {
  name: 'RouteView',
  render: (h) => h('router-view'),
};

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: () => import('@/layouts/BasicLayout.vue'),
    meta: { title: 'menu.home' },
    redirect: '/system/user',
    children: [],
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true,
  },
];

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/home',
    component: () => import('@/views/home/index.vue'),
    hidden: true,
    name:"home"
  },
  {
    path: '/news',
    component: () => import('@/views/news/index.vue'),
    hidden: true,
    name:"news"
  },
  {
    path: '/aboutUs',
    component: () => import('@/views/aboutUs/index.vue'),
    hidden: true,
    name:"aboutUs"
  },
  {
    path: '/search',
    component: () => import('@/views/search/index.vue'),
    hidden: true,
    name:"search"
  },
  {
    path: '/newsDetail/:id',
    component: () => import('@/views/news/newsDetail/index.vue'),
    hidden: true,
    name:"newsDetail"
  },
  {
    path: '/user',
    component: () => import('@/layouts/UserLayout.vue'),
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/login/Login.vue'),
        meta: {
          title: '登录',
        },
      },
    ],
  },
  {
    path: '/purchaser/supplier/Register/:invitationId',
    name: 'register',
    component: () => import('@/views/Purchaser/Supplier/Register.vue'),
    hidden: true,
    meta: {
      title: '供应商注册申请',
    },
    props: true,
  },
  // {
  //   path: '/',
  //   name: 'index',
  //   component: () => import('@/layouts/UserLayout.vue'),
  //   meta: { title: '测试' },
  //   redirect: '/testForm',
  //   children: [
  //     {
  //       path: 'testForm',
  //       name: 'testForm',
  //       component: () => import(/* webpackChunkName: "user" */ '@/views/Test/TestForm.vue'),
  //       meta: {
  //         title: 'form测试',
  //       },
  //     },
  //     {
  //       path: 'testTable',
  //       name: 'testTable',
  //       component: () => import(/* webpackChunkName: "user" */ '@/views/Test/Table.vue'),
  //       meta: {
  //         title: 'table测试',
  //       },
  //     },
  //     {
  //       path: 'testTableForm',
  //       name: 'testTableForm',
  //       component: () => import(/* webpackChunkName: "user" */ '@/views/Test/TableSearch.vue'),
  //       meta: {
  //         title: 'tableForm测试',
  //       },
  //     },
  //   ],
  // },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404.vue'),
  },
];
