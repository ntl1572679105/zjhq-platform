<template>
  <div class="sub-title-box">
    <div class="left-line"></div>
    <span class="left-title">{{ title }}</span>
    <slot name="right"></slot>
  </div>
</template>

<script setup>
defineProps({
  title: String,
});
</script>

<style lang="less" scoped>
.sub-title-box {
  display: flex;
  align-items: center;
  height: 40px;
  margin-bottom: 20px;
  background: #fafafa;
  padding: 0 16px;
  .left-line {
    width: 4px;
    height: 12px;
    background: #1b77ff;
    border-radius: 1px;
  }
  .left-title {
    margin-left: 12px;
    font-weight: 500;
    font-size: 14px;
    color: #000000d9;
    flex: 1;
  }
}
</style>
