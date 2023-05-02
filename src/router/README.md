# 路由/菜单说明

参考 andt-vue-admin-pro 形式

### 本地路由

1. 根目录下的 permission.js 文件关闭菜单请求，直接 next 跳转
2. 本目录下的 index.js 设置 routes。（可以在 config 文件夹下 router.config.js 添加）

#### 路由格式

在 localRouterMap 根路由下 children 添加。

```js
name: 'router-name',
path: '/path', // 目录菜单
component: () => import('@/layouts/BlankLayout.vue'), // 懒加载组件
redirect: '/customer/list', // 目录菜单重定向
meta: {
 title: '客户管理', //目录名称
},
children: [ // 菜单组
 {
   name: 'customer-list',
   path: '/customer/list',
   hideChildInMenu: true,
   component: () => import('@/views/customer/CustomerList.vue'),
   meta: {
     title: '客户列表',
     hiddenHeaderContent: true,
   },
 },
 {
   name: 'customer-detail',
   path: '/customer/list/:id',
   component: () => import('@/views/customer/CustomerDetail.vue'),
   meta: {
     title: '客户详情',
     params: { id: 1 },
     hiddenHeaderContent: true,
     hideInMenu: true, // 不显示菜单
     parentPath: '/customer/list', // 面包屑
     parentTitle: '客户列表' // 面包屑
   },
   props: true,
 },
]
```

### 动态路由

1. 根目录下的 permission.js 文件开启菜单请求
2. 本目录下的 index.js 设置 routes 为空数组
3. 本目录下的 generator-routers.js 添加路由映射关系

#### 路由格式

```js
// key为接口返回的菜单path，本菜单下的详情、添加等二级页面
menuMap.set('customerManage', {
  name: 'customer-list',
  path: '/customer/list',
  component: () => import('@/views/customer/CustomerList.vue'),
  children: [
    {
      name: 'customer-detail',
      path: '/customer/list/:id',
      component: () => import('@/views/customer/CustomerDetail.vue'),
      meta: {
        title: '客户详情',
        params: { id: 1 },
      },
      props: true,
    },
  ],
});
```

#### 接口返回

```json
[
  {
    "createBy": null,
    "createTime": "2021-09-15 14:45:33",
    "updateBy": null,
    "updateTime": null,
    "remark": null,
    "menuId": 7,
    "menuName": "首页概览",
    "parentId": 0,
    "orderNum": 1,
    "path": "index",
    "frame": 0,
    "menuType": "M",
    "visible": 0,
    "status": 0,
    "perms": "",
    "children": []
  },
  {
    "createBy": null,
    "createTime": "2021-09-15 14:45:33",
    "updateBy": null,
    "updateTime": null,
    "remark": null,
    "menuId": 5,
    "menuName": "订单管理",
    "parentId": 0,
    "orderNum": 2,
    "path": "order",
    "frame": 0,
    "menuType": "M",
    "visible": 0,
    "status": 0,
    "perms": "",
    "children": [
      {
        "createBy": null,
        "createTime": "2021-09-15 14:45:33",
        "updateBy": null,
        "updateTime": null,
        "remark": null,
        "menuId": 125,
        "menuName": "订单列表",
        "parentId": 5,
        "orderNum": 2,
        "path": "orderManage",
        "frame": 0,
        "menuType": "C",
        "visible": 0,
        "status": 0,
        "perms": "",
        "children": []
      }
    ]
  },
  {
    "createBy": null,
    "createTime": "2021-09-15 14:45:33",
    "updateBy": null,
    "updateTime": null,
    "remark": null,
    "menuId": 3,
    "menuName": "客户管理",
    "parentId": 0,
    "orderNum": 3,
    "path": "customer",
    "frame": 0,
    "menuType": "M",
    "visible": 0,
    "status": 0,
    "perms": "",
    "children": [
      {
        "createBy": null,
        "createTime": "2021-09-15 14:45:33",
        "updateBy": null,
        "updateTime": null,
        "remark": null,
        "menuId": 123,
        "menuName": "客户列表",
        "parentId": 3,
        "orderNum": 1,
        "path": "customerManage",
        "frame": 0,
        "menuType": "C",
        "visible": 0,
        "status": 0,
        "perms": "",
        "children": []
      },
      {
        "createBy": null,
        "createTime": "2021-09-15 14:45:33",
        "updateBy": null,
        "updateTime": null,
        "remark": null,
        "menuId": 124,
        "menuName": "合同管理",
        "parentId": 3,
        "orderNum": 2,
        "path": "contractManage",
        "frame": 0,
        "menuType": "C",
        "visible": 0,
        "status": 0,
        "perms": "",
        "children": []
      }
    ]
  },
  {
    "createBy": null,
    "createTime": "2021-09-15 14:45:33",
    "updateBy": null,
    "updateTime": null,
    "remark": null,
    "menuId": 2,
    "menuName": "资产管理",
    "parentId": 0,
    "orderNum": 4,
    "path": "asset",
    "frame": 0,
    "menuType": "M",
    "visible": 0,
    "status": 0,
    "perms": "",
    "children": [
      {
        "createBy": null,
        "createTime": "2021-09-15 14:45:33",
        "updateBy": null,
        "updateTime": null,
        "remark": null,
        "menuId": 120,
        "menuName": "资产总览",
        "parentId": 2,
        "orderNum": 1,
        "path": "assetOverview",
        "frame": 0,
        "menuType": "C",
        "visible": 0,
        "status": 0,
        "perms": "",
        "children": []
      },
      {
        "createBy": null,
        "createTime": "2021-09-15 14:45:33",
        "updateBy": null,
        "updateTime": null,
        "remark": null,
        "menuId": 121,
        "menuName": "仓库总览",
        "parentId": 2,
        "orderNum": 2,
        "path": "warehouseOverview",
        "frame": 0,
        "menuType": "C",
        "visible": 0,
        "status": 0,
        "perms": "",
        "children": []
      },
      {
        "createBy": null,
        "createTime": "2021-09-15 14:45:33",
        "updateBy": null,
        "updateTime": null,
        "remark": null,
        "menuId": 122,
        "menuName": "调拨管理",
        "parentId": 2,
        "orderNum": 3,
        "path": "transferManage",
        "frame": 0,
        "menuType": "C",
        "visible": 0,
        "status": 0,
        "perms": "",
        "children": []
      }
    ]
  },
  {
    "createBy": null,
    "createTime": "2021-09-15 14:45:33",
    "updateBy": null,
    "updateTime": null,
    "remark": null,
    "menuId": 6,
    "menuName": "仓储管理",
    "parentId": 0,
    "orderNum": 5,
    "path": "warehouse",
    "frame": 0,
    "menuType": "M",
    "visible": 0,
    "status": 0,
    "perms": "",
    "children": [
      {
        "createBy": null,
        "createTime": "2021-09-15 14:45:33",
        "updateBy": null,
        "updateTime": null,
        "remark": null,
        "menuId": 127,
        "menuName": "入库单",
        "parentId": 6,
        "orderNum": 2,
        "path": "warehouseOrder",
        "frame": 0,
        "menuType": "C",
        "visible": 0,
        "status": 0,
        "perms": "",
        "children": []
      },
      {
        "createBy": null,
        "createTime": "2021-09-15 14:45:33",
        "updateBy": null,
        "updateTime": null,
        "remark": null,
        "menuId": 128,
        "menuName": "出库单",
        "parentId": 6,
        "orderNum": 2,
        "path": "deliveryOrder",
        "frame": 0,
        "menuType": "C",
        "visible": 0,
        "status": 0,
        "perms": "",
        "children": []
      },
      {
        "createBy": null,
        "createTime": "2021-09-15 14:45:33",
        "updateBy": null,
        "updateTime": null,
        "remark": null,
        "menuId": 129,
        "menuName": "差异单",
        "parentId": 6,
        "orderNum": 2,
        "path": "differenceOrder",
        "frame": 0,
        "menuType": "C",
        "visible": 0,
        "status": 0,
        "perms": "",
        "children": []
      },
      {
        "createBy": null,
        "createTime": "2021-09-15 14:45:33",
        "updateBy": null,
        "updateTime": null,
        "remark": null,
        "menuId": 130,
        "menuName": "库存盘点",
        "parentId": 6,
        "orderNum": 2,
        "path": "stockTaking",
        "frame": 0,
        "menuType": "C",
        "visible": 0,
        "status": 0,
        "perms": "",
        "children": []
      }
    ]
  },
  {
    "createBy": null,
    "createTime": "2021-09-15 14:45:33",
    "updateBy": null,
    "updateTime": null,
    "remark": null,
    "menuId": 4,
    "menuName": "员工管理",
    "parentId": 0,
    "orderNum": 6,
    "path": "user",
    "frame": 0,
    "menuType": "M",
    "visible": 0,
    "status": 0,
    "perms": "",
    "children": [
      {
        "createBy": null,
        "createTime": "2021-09-15 14:45:33",
        "updateBy": null,
        "updateTime": null,
        "remark": null,
        "menuId": 100,
        "menuName": "员工列表",
        "parentId": 4,
        "orderNum": 1,
        "path": "userManage",
        "frame": 0,
        "menuType": "C",
        "visible": 0,
        "status": 0,
        "perms": "",
        "children": []
      }
    ]
  },
  {
    "createBy": null,
    "createTime": "2021-09-15 14:45:33",
    "updateBy": null,
    "updateTime": null,
    "remark": null,
    "menuId": 8,
    "menuName": "数据报表",
    "parentId": 0,
    "orderNum": 7,
    "path": "report",
    "frame": 0,
    "menuType": "M",
    "visible": 0,
    "status": 0,
    "perms": "",
    "children": []
  },
  {
    "createBy": null,
    "createTime": "2021-09-15 14:45:33",
    "updateBy": null,
    "updateTime": null,
    "remark": null,
    "menuId": 1,
    "menuName": "系统管理",
    "parentId": 0,
    "orderNum": 8,
    "path": "sys",
    "frame": 0,
    "menuType": "M",
    "visible": 0,
    "status": 0,
    "perms": "",
    "children": [
      {
        "createBy": null,
        "createTime": "2021-09-15 14:45:33",
        "updateBy": null,
        "updateTime": null,
        "remark": null,
        "menuId": 101,
        "menuName": "角色管理",
        "parentId": 1,
        "orderNum": 2,
        "path": "roleManage",
        "frame": 0,
        "menuType": "C",
        "visible": 0,
        "status": 0,
        "perms": "",
        "children": []
      },
      {
        "createBy": null,
        "createTime": "2021-09-15 14:45:33",
        "updateBy": null,
        "updateTime": null,
        "remark": null,
        "menuId": 103,
        "menuName": "公共接口管理",
        "parentId": 1,
        "orderNum": 2,
        "path": "commonInterfaceManage",
        "frame": 0,
        "menuType": "C",
        "visible": 1,
        "status": 0,
        "perms": "",
        "children": []
      },
      {
        "createBy": null,
        "createTime": "2021-09-15 14:45:33",
        "updateBy": null,
        "updateTime": null,
        "remark": null,
        "menuId": 126,
        "menuName": "审批流设置",
        "parentId": 1,
        "orderNum": 3,
        "path": "approveConfig",
        "frame": 0,
        "menuType": "C",
        "visible": 0,
        "status": 0,
        "perms": "",
        "children": []
      }
    ]
  }
]
```
