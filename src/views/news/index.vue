<template>
  <div class="page">
    <topHeaderVue></topHeaderVue>
    <topNavVue></topNavVue>
    <img src="@/assets/images/Home/banner_info@2x.png" alt="" style="width: 100%; height: 360px" />
    <div class="content">
      <div class="news-item" v-for="item in list" :key="item" @click="goNewsDetailRoute(item)">
        <div class="left"><file-text-filled style="color: #fb6e23"/></div>
        <div class="right">
          <div class="title">{{ item.title }}</div>
          <div class="time">— {{ item.updateTime }}</div>
          <div class="article">
            {{ item.remark }}
          </div>
        </div>
      </div>
    </div>
    <bottomVue></bottomVue>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import topHeaderVue from '../home/topHeader/index.vue';
import topNavVue from '../home/topNav/index.vue';
import bottomVue from '../home/bottom/index.vue';

import { informationPage } from '@/api/home';

const router = useRouter();
const goNewsDetailRoute = (item) => {
  router.push(`/newsDetail/${item.id}`);
};

const list = ref([]);

const getList = () => {
  const params = {
    status: 0,
  };
  informationPage(params).then((res) => {
    list.value = res.data;
  });
};

onMounted(() => {
  getList();
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
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  align-content: flex-start;
  padding: 25px 0;
  .news-item {
    width: 590px;
    height: 120px;
    background-color: white;
    padding: 15px;
    display: flex;
    cursor: pointer;
    .left {
      width: 30px;
    }

    .right {
      width: 530px;
      div {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .title {
        font-size: 16px;
        font-weight: 700;
      }

      .time {
        margin-top: 5px;
        color: #00000073;
      }

      .article {
        margin-top: 10px;
      }
    }
  }

  .news-item:hover .title {
    color: #fb6e23;
  }
}
</style>
