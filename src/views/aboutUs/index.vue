<template>
  <div class="page">
    <topHeaderVue></topHeaderVue>
    <topNavVue></topNavVue>
    <nav>
      <img
        src="@/assets/images/Home/banner_about@2x.png"
        alt=""
        style="width: 100%; height: 360px"
      />
      <section>
        <img src="@/assets/images/Home/icon-1@2x.png" alt="" style="width: 16px; height: 15px" />
        <div class="text1">关于我们</div>
        <div class="text2">About us</div>
      </section>
    </nav>
    <div class="content">
      <div class="title">关于“浙好淘”</div>
      <div class="divide"></div>
      <img src="@/assets/images/Home/aboutUS1.png" alt="" style="width: 100%; height: 90px" />
      <img
        src="@/assets/images/Home/image_logo@2x.png"
        alt=""
        style="width: 100%; height: 319px; margin: 32px 0"
      />
      <img src="@/assets/images/Home/aboutUs2.png" alt="" style="width: 100%; height: 90px" />
    </div>
    <bottomVue></bottomVue>
  </div>
</template>

<script setup>
import topHeaderVue from '../home/topHeader/index.vue';
import topNavVue from '../home/topNav/index.vue';
import bottomVue from '../home/bottom/index.vue';
</script>

<style lang="less" scoped>
.page {
  background-color: white;
}
nav {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  section {
    position: absolute;
    width: 1200px;
    .text1 {
      color: white;
      font-size: 40px;
      margin-top: 20px;
    }
    .text2 {
      font-size: 18px;
      color: #ffffffa6;
      letter-spacing: 2px;
      margin-top: 8px;
    }
  }
}
.content {
  margin: 0 auto;
  width: 900px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 0;

  .title {
    font-weight: 700;
    font-size: 28px;
    color: #000000d9;
  }

  .divide {
    margin-top: 24px;
    margin-bottom: 40px;
    width: 64px;
    height: 4px;
    background: #fb6e23;
  }
}
</style>
