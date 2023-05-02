<template>
  <div class="top-header">
    <div class="top-header-container">
      <div class="left"></div>
      <div class="right">
        <div>
          <a class="">采购指南</a>
        </div>
        <div class="align-center">
          <img
            src="@/assets/images/Home/icon_phone_filled@2x.png"
            alt=""
            style="width: 20px; height: 20px"
          />
          <a class="ml-5">联系方式：400-000-0000</a>
        </div>
        <div class="align-center" @click.stop="goLogin">
          <img
            src="@/assets/images/Home/icon_gongyingshang@2x.png"
            alt=""
            style="width: 20px; height: 20px"
          />
          <a class="ml-5">供应商入驻</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

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
.top-header {
  width: 100vw;
  background: #f5f5f5;
}

.top-header-container {
  width: 1200px;
  margin: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 36px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.65);

  div {
    cursor: pointer;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.65);
    letter-spacing: 0;
  }
}

.right {
  display: flex;
  & > div {
    padding: 0 15px;
    height: 15px;
    line-height: 15px;
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    text-align: center;
    margin: auto;
  }
  & > div:last-child {
    border: none;
    padding-right: 0;
  }
}
</style>
