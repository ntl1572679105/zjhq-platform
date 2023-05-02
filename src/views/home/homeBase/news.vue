<template>
  <div class="news">
    <header>
      <div class="right">
        <span class="title">资讯信息</span>
        <span class="description">资讯/公告</span>
      </div>
      <div class="left" @click="goNewsRoute">
        <span> 查看全部 </span>
        <right-outlined />
      </div>
    </header>

    <div class="news-content">
      <div class="news-item" v-for="item in list" :key="item" @click="goNewsDetailRoute(item)">
        <div class="left"><file-text-filled style="color: #fb6e23" /></div>
        <div class="right">
          <div class="title">{{ item.title }}</div>
          <div class="time">— {{ item.updateTime }}</div>
          <div class="article">
            {{ item.remark }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { informationPage } from '@/api/home';

const router = useRouter();

const list = ref([]);

const goNewsDetailRoute = (item) => {
  router.push(`/newsDetail/${item.id}`);
};

const goNewsRoute = () => {
  router.push('/news');
};

const getList = () => {
  const params = {
    pageNum: 1,
    pageSize: 4,
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
.news {
  margin-top: 35px;
}

.news-content {
  display: flex;
  gap: 15px;
  margin-top: 15px;
  flex-wrap: wrap;

  .news-item {
    width: 590px;
    border: 1px solid #fff;
    height: 118px;
    background-color: white;
    padding: 15px;
    display: flex;
    cursor: pointer;
    transition: 0.3s all;
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

  .news-item:hover {
    .title {
      color: #fb6e23;
    }
    border: 1px solid #fb6e23;
    box-shadow: 0 2px 6px 0 #0000000a, 0 4px 16px 0 #0000000d;
  }
}
</style>
