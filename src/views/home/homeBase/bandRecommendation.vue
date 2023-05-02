<template>
  <div class="band">
    <header>
      <div class="right">
        <img src="@/assets/images/Home/home_icon_1@2x(1).png" style="width: 50px; height: 50px" />
        <span class="title">品牌专区</span>
      </div>
      <div class="left">
        <span> 查看全部 </span>
        <right-outlined />
      </div>
    </header>

    <div class="content">
      <div class="band-bar" v-for="item in band" :key="item">
        <img :src="item.url" alt="" style="width: 100%; height: 100%" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const band = ref([
  { url: new URL('../../../assets/images/Home/brand_1@2x.png', import.meta.url).href },
  { url: new URL('../../../assets/images/Home/brand_2@2x.png', import.meta.url).href },
  { url: new URL('../../../assets/images/Home/brand_3@2x.png', import.meta.url).href },
  { url: new URL('../../../assets/images/Home/brand_4@2x.png', import.meta.url).href },
  { url: new URL('../../../assets/images/Home/brand_5@2x.png', import.meta.url).href },
  { url: new URL('../../../assets/images/Home/brand_6@2x.png', import.meta.url).href },
  { url: new URL('../../../assets/images/Home/brand_7@2x.png', import.meta.url).href },
  { url: new URL('../../../assets/images/Home/brand_8@2x.png', import.meta.url).href },
]);
</script>

<style lang="less" scoped>
.band {
  margin-top: 30px;
}

.content {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  .band-bar {
    width: 294px;
    height: 112px;
    box-sizing: border-box;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
