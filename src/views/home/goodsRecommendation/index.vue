<template>
  <div class="page">
    <div class="goods">
      <hotRecommendationVue></hotRecommendationVue>
      <bandPromotionsVue></bandPromotionsVue>
      <realTimeGoodsVue></realTimeGoodsVue>
    </div>
  </div>
</template>

<script setup>
import hotRecommendationVue from './hotRecommendation.vue';
import bandPromotionsVue from './bandPromotions.vue';
import realTimeGoodsVue from './realTimeGoods.vue';
</script>

<style lang="less" scoped>
.page {
  margin-top: 30px;
  background-color: white;
}
.goods {
  width: 1200px;
  height: auto;
  margin: 0 auto;
}
</style>
