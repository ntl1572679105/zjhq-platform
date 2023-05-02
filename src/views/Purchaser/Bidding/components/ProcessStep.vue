<template>
  <div style="padding: 0 40px 20px">
    <a-steps :current="status">
      <a-step
        v-for="(item, index) in options"
        :key="index"
        :title="item"
        :description="data[index]"
      ></a-step>
    </a-steps>
  </div>
</template>

<script setup>
defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  status: {
    type: Number,
    required: true,
  },
});

const options = ['建标', '投标中', '投标截止', '开标', '评标中', '定标', '中标通知'];
</script>

<style lang="less" scoped>
:deep(.ant-steps-item-description) {
  // white-space: nowrap !important;
  // word-break: break-all;
  white-space: pre-wrap !important;
}
</style>
