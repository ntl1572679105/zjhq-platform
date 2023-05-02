<template>
  <div class="home">
    <topHeaderVue></topHeaderVue>
    <topNavVue></topNavVue>
    <homeBaseVue></homeBaseVue>
    <goodsRecommendationVue></goodsRecommendationVue>
    <clientVue></clientVue>
    <bottomVue></bottomVue>
  </div>
</template>

<script setup>
import topHeaderVue from './topHeader/index.vue';
import topNavVue from './topNav/index.vue';
import homeBaseVue from './homeBase/index.vue';
import goodsRecommendationVue from './goodsRecommendation/index.vue';
import clientVue from './client/index.vue';
import bottomVue from './bottom/index.vue';
</script>

<style lang="less" scoped>
.home {
  height: auto;
  background-color: #f5f5f5;
}
</style>

<style lang="less">
header {
  width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;

  .right {
    .title {
      font-weight: 700;
      font-size: 22px;
    }
    .description {
      margin-left: 10px;
      color: #000000a6;
    }
  }
  .left {
    display: flex;
    align-items: center;
    color: #fb6e23;
    cursor: pointer;
    & span:first-child {
      margin-right: 5px;
    }
  }
}
</style>
