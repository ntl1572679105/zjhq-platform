<template>
  <a-list style="padding: 0 33px" item-layout="vertical" :pagination="false" :data-source="data">
    <template #renderItem="{ item }">
      <div class="item-box">
        <div>
          <span>问题描述：</span>
          <span>{{ item.description }}</span>
        </div>
        <div>
          <span>招标方回复：</span>
          <span>{{ item.answer }}</span>
        </div>
      </div>
    </template>
  </a-list>
</template>

<script setup>
defineProps({
  data: {
    type: Array,
    default: () => [],
  },
});
</script>

<style lang="less" scoped>
.item-box {
  border: 1px solid #00000014;
  border-radius: 2px;
  margin-bottom: 16px;
  padding: 12px;
  .item-title {
    opacity: 0.85;
    font-weight: 500;
    font-size: 16px;
    color: #000000;
    line-height: 24px;
    padding: 16px 16px 0;
  }
  div {
    overflow: hidden;
    word-break: break-word;
    display: flex;
    span:nth-child(1) {
      flex-shrink: 0;
    }
    span:nth-child(2) {
      flex: 1;
    }
  }
  div:nth-child(1) {
    margin-bottom: 12px;
  }
}
</style>
