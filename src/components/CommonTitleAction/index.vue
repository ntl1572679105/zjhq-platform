<template>
  <div class="common-title-box">
    <img :src="getImageName(module)" class="left-image" />
    <span class="left-title">{{ title }}</span>
    <slot name="right"></slot>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  module: {
    // 图片模块，1：供应商
    type: String,
    defualt: '1',
  },
});

const getImageName = (module) => {
  let imageName = '';
  switch (module) {
    case '1':
      imageName = 'icon_supplier@2x.png';
      break;
    default:
      imageName = 'icon_supplier@2x.png';
  }
  return new URL(`../../assets/images/${imageName}`, import.meta.url).href;
};
</script>

<style lang="less" scoped>
.common-title-box {
  display: flex;
  align-items: center;
  height: 72px;
  background: #ffffff;
  border-radius: 2px;
  margin-bottom: 18px;
  padding: 0 16px;
  .left-image {
    width: 40px;
    height: 40px;
  }
  .left-title {
    margin-left: 12px;
    font-weight: 500;
    font-size: 18px;
    color: #000000d9;
    flex: 1;
  }
}
</style>
