<template>
  <pro-layout
    :menu-data="menuData"
    v-model:selectedKeys="state.selectedKeys"
    v-model:openKeys="state.openKeys"
    :breadcrumb="{ routes: state.breadcrumb }"
    style="min-height: 100vh"
    v-bind="proConfig"
  >
    <template #menuHeaderRender>
      <router-link :to="{ path: '/' }">
        <img src="@/assets/images/menu-logo@2x.png" style="width: auto; height: 96px" />
        <!-- <span class="title">{{ proConfig.title }}</span> -->
      </router-link>
    </template>

    <template #rightContentRender>
      <RightContent />
    </template>

    <!-- custom breadcrumb itemRender  -->
    <template #breadcrumbRender="{ route, params, routes }">
      <span v-if="routes.indexOf(route) === routes.length - 1">
        {{ route.breadcrumbName }}
      </span>
      <router-link v-else :to="{ path: route.path, params }">
        {{ route.breadcrumbName }}
      </router-link>
    </template>

    <template #collapsedButtonRender>
      <span></span>
    </template>

    <!-- <router-view /> -->
    <RouterView v-slot="{ Component, route }">
      <transition name="slide-left" mode="out-in">
        <component :is="Component" :key="route.path" />
      </transition>
    </RouterView>
  </pro-layout>
</template>

<script setup>
import { watch, reactive } from 'vue';
import { useRouter, RouterView, RouterLink } from 'vue-router';
import { getMenuData, clearMenuItem } from '@ant-design-vue/pro-layout';

import defaultSettings from '@/config/defaultSettings';
import RightContent from '@/components/GlobalHeader/RightContent.vue';

const proConfig = defaultSettings;
const state = reactive({
  openKeys: [], // defualt openKeys
  selectedKeys: [], // default selectedKeys
  breadcrumb: [],
});

const router = useRouter();
const { menuData } = getMenuData(clearMenuItem(router.getRoutes()));

// const breadcrumb = computed(() =>
//   router.currentRoute.value.matched.concat().map(item => {
//     return {
//       path: item.path,
//       breadcrumbName: item.meta.title || '',
//     };
//   }),
// );

watch(
  router.currentRoute,
  () => {
    const matched = router.currentRoute.value.matched.concat();
    state.selectedKeys = matched
      .filter((r) => r.name !== 'index')
      .map((r) => r.meta.parentPath || r.path);
    state.openKeys = matched
      .filter((r) => r.path !== router.currentRoute.value.path)
      .map((r) => r.path);
    state.breadcrumb = [];
    matched.forEach((item) => {
      if (item.meta.title) {
        if (item.meta.parentTitle) {
          state.breadcrumb.push({
            path: item.meta.parentPath,
            breadcrumbName: item.meta.parentTitle,
          });
        }
        state.breadcrumb.push({ path: item.path, breadcrumbName: item.meta.title });
      }
    });
  },
  {
    immediate: true,
  },
);
</script>

<style lang="less">
@import './BasicLayout.less';
//.title {
//  font-size: 18px;
//  font-family: zihun143-zhengkuchaojihei, zihun143;
//  font-weight: normal;
//  color: #ffffff;
//  line-height: 22px;
//  margin-left: 6px;
//}
</style>
