<template>
  <div class="view">
    <header>
      <div class="right">
        <img src="@/assets/images/Home/home_icon_5@2x.png" style="width: 50px; height: 50px" />
        <span class="title">服务单位</span>
      </div>
      <div class="left"></div>
    </header>

    <div class="content">
      <div class="left-linear"></div>
      <div class="right-linear"></div>
      <Vue3SeamlessScroll :list="imgList" class="scroll" direction="left">
      <div class="items">
        <div class="item" v-for="(item, index) in imgList" :key="index">
          <img :src="item.url" alt="" style="width: 100%; height: 100%" />
        </div>
      </div>
    </Vue3SeamlessScroll>
    <div style="margin-top: 24px;"></div>
    <Vue3SeamlessScroll :list="imgList" class="scroll" direction="right">
      <div class="items">
        <div class="item" v-for="(item, index) in imgList" :key="index">
          <img :src="item.url" alt="" style="width: 100%; height: 100%" />
        </div>
      </div>
    </Vue3SeamlessScroll>
    </div>

  </div>
</template>

<script setup>
import { Vue3SeamlessScroll } from 'vue3-seamless-scroll';

const imgList = [
  { url: new URL('@/assets/images/Home/unit_logo_1@2x.png', import.meta.url).href },
  { url: new URL('@/assets/images/Home/unit_logo_2@2x.png', import.meta.url).href },
  { url: new URL('@/assets/images/Home/unit_logo_3@2x.png', import.meta.url).href },
  { url: new URL('@/assets/images/Home/unit_logo_4@2x.png', import.meta.url).href },
  { url: new URL('@/assets/images/Home/unit_logo_5@2x.png', import.meta.url).href },
  { url: new URL('@/assets/images/Home/unit_logo_6@2x.png', import.meta.url).href },
  { url: new URL('@/assets/images/Home/unit_logo_1@2x.png', import.meta.url).href },
  { url: new URL('@/assets/images/Home/unit_logo_2@2x.png', import.meta.url).href },
  { url: new URL('@/assets/images/Home/unit_logo_3@2x.png', import.meta.url).href },
  { url: new URL('@/assets/images/Home/unit_logo_4@2x.png', import.meta.url).href },
  { url: new URL('@/assets/images/Home/unit_logo_5@2x.png', import.meta.url).href },
  { url: new URL('@/assets/images/Home/unit_logo_6@2x.png', import.meta.url).href },
];
</script>

<style lang="less" scoped>
.items {
  display: flex;
  gap: 24px;
  .item {
    width: 212px;
    height: 72px;
    background-color: white;
  }
}

.content {
  position: relative;

  .left-linear {
    position: absolute;
    left: 0;
    z-index: 50;
    width: 308px;
    height: 168px;
    background: linear-gradient(270deg, #f6f6f600 25%, #f6f6f6d9 52%, #f6f6f6 100%);
  }
  .right-linear {
    position: absolute;
    right: 0;
    z-index: 50;
    width: 308px;
    height: 168px;
    background: linear-gradient(90deg, #f6f6f600 25%, #f6f6f6d9 52%, #f6f6f6 100%);
  }
}

.view {
  padding: 25px 0;
}
</style>
