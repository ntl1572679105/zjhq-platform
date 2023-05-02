/**
 * 项目默认配置项
 * primaryColor - 默认主题色, 如果修改颜色不生效，请清理 localStorage
 * navTheme - sidebar theme ['dark', 'light'] 两种主题
 * colorWeak - 色盲模式
 * layout - 整体布局方式 ['sidemenu', 'topmenu'] 两种布局
 * fixedHeader - 固定 Header : boolean
 * fixSiderbar - 固定左侧菜单栏 ： boolean
 * contentWidth - 内容区布局： 流式 |  固定
 *
 * storageOptions: {} - Vue-ls 插件配置项 (localStorage/sessionStorage)
 *
 * https://github.com/vueComponent/pro-components/tree/next/packages/pro-layout
 */

export default {
  title: '省后勤',
  logo: '', //  layout top left logo url
  navTheme: 'dark', // 'light' |'dark'
  headerTheme: 'light', // 'light' |'dark'
  layout: 'side', // 'side' | 'top' | 'mix'
  contentWidth: 'Fluid', // content mode of layout, Fluid: adaptive, Fixed: fixed width 1200px: 'Fixed' | 'Fluid'

  // menuData: [{}], // Vue-router routes prop : [{}]
  collapsed: false, // control menu's collapse and expansion

  // selectedKeys: [], // menu selected keys
  // openKeys: [], // menu openKeys

  fixedHeader: true, // sticky header
  fixSiderbar: true, // sticky siderbar
};
