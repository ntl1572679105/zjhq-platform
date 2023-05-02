<template>
  <div class="page">
    <topHeaderVue></topHeaderVue>
    <topNavVue></topNavVue>

    <div class="content">
      <h1>{{ info.title }}</h1>
      <div class="mb-8">{{ info.updateBy || info.createBy }} {{ info.updateTime }}</div>
      <article>
        {{ info.remark }}
      </article>
    </div>
    <bottomVue></bottomVue>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import topHeaderVue from '@/views/home/topHeader/index.vue';
import topNavVue from '@/views/home/topNav/index.vue';
import bottomVue from '@/views/home/bottom/index.vue';

import { informationDetail } from '@/api/home';

const route = useRoute();

const info = ref({});

const getInfo = () => {
  const { id } = route.params;
  informationDetail(id).then((res) => {
    info.value = res;
  });
};

onMounted(() => {
  getInfo();
});
</script>

<style lang="less" scoped>
.page {
  background-color: #f6f6f6;
}
.content {
  width: 1200px;
  margin: 0 auto;
  min-height: 565px;
  padding: 25px 0;
}
</style>
