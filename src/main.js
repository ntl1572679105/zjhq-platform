// with polyfills
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import '@ant-design-vue/pro-layout/dist/style.css'; // pro-layout css or style.less

import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';
import store from './store';
import { VueAxios, VueAxios2 } from './utils/request';

// 国际化
import i18n from './locales';

//  import vue3SeamlessScroll from "vue3-seamless-scroll";

import antdComponent from './core/lazy_use'; // 组件懒加载
import ProLayout, { PageContainer } from '@ant-design-vue/pro-layout';
import icons from '@/layouts/icons.js';
import './permission'; // 全局路由权限控制
import './assets/styles/global.less'; // 全局less

import categoryMenuVue from "@/views/search/categoryMenu/index.vue"

const app = createApp(App);

app.component('categoryMenuVue', categoryMenuVue)


app.use(VueAxios);
app.use(VueAxios2);
app.use(i18n);

app.use(router);
app.use(store);
antdComponent(app);
app.use(ProLayout);
app.use(PageContainer);
app.use(icons);
app.mount('#app');
// app.use(vue3SeamlessScroll);