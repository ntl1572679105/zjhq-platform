<template>
  <div class="homeBase">
    <sortModuleVue></sortModuleVue>
    <newsVue></newsVue>
    <catrgoryRecommendationVue></catrgoryRecommendationVue>
    <bandRecommendationVue></bandRecommendationVue>
  </div>
</template>

<script setup>
import sortModuleVue from './sortModule.vue';
import newsVue from './news.vue';
import catrgoryRecommendationVue from './catrgoryRecommendation .vue';
import bandRecommendationVue from './bandRecommendation.vue';
</script>

<style lang="less" scoped>
.homeBase {
  width: 1200px;
  height: auto;
  margin: 0 auto;
  margin-top: 10px;
  position: relative;
}
</style>
