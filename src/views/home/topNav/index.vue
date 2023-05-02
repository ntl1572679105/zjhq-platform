<template>
  <div class="top-nav">
    <div class="top-nav-content">
      <div class="left">
        <img class="log-img" src="@/assets/images/app-logo@2x.png" />
      </div>
      <div class="right">
        <div class="link-items">
          <a @click="goHomeRoute" :class="{active:route.name=='home'}">首页</a>
          <a @click="goNewsRoute" :class="{active:route.name=='news'}">资讯信息</a>
          <a @click="goAboutUsRoute" :class="{active:route.name=='aboutUs'}">关于我们</a>
        </div>
        <a-input-search
          v-model:value="searchValue"
          size="large"
          placeholder="请输入商品名称"
          style="width: 300px"
          @search="onSearch"
        />
        <div class="ml-20">
          <a-button size="large" type="primary" @click.stop="goLogin">
            <template #icon><user-outlined /></template>
            用户登录
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const searchValue = ref('');

const goHomeRoute = () => {
  router.push('/home');
};

const goNewsRoute = () => {
  router.push('/news');
};

const onSearch = () => {
  router.push('/search');
}

const goAboutUsRoute=()=>{
  router.push('/aboutUs');
}

const goLogin = () => {
  router.push('/user/login');
};
</script>

<style lang="less" scoped>
a{
  color:black
}
a:hover{
  color:#fb6e23;
}
.active {
  color: #fb6e23;
}
.ant-btn {
  background-color: #fb6e23;
  border: none;
  border-radius: 4px;
}
.top-nav {
  background-color: #fff;
  display: flex;
  height: 112px;
  align-items: center;
  white-space: nowrap;
  display: flex;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100vw;
}

.top-nav-content {
  width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  .left {
    .log-img {
      width: 350px;
      height: 44px;
    }
  }
  .right {
    display: flex;
    .link-items {
      display: flex;
      align-items: center;
      font-size: 16px;
      a {
        margin-right: 32px;
      }
    }
  }
}
</style>
