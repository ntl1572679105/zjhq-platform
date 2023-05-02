<template>
  <a-modal
    v-model:visible="visible"
    title="消息中心"
    :destroy-on-close="true"
    :width="1000"
    :footer="null"
  >
    <a-tabs
      v-model:activeKey="activeKey"
      tab-position="left"
      :style="{ height: '70vh', overflow: 'auto' }"
    >
      <a-tab-pane v-for="(item, index) in tabs" :key="index" :tab="item.name">
        <ListView :params="{ bizType: item.bizType }" />
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script setup>
import { ref } from 'vue';
import ListView from './List.vue';

const activeKey = ref(0);
const tabs = [
  { name: '审批消息', bizType: '审批消息' },
  { name: '系统消息', bizType: '系统消息' },
];

const visible = ref(false);

const show = () => {
  visible.value = true;
};

// 按钮操作
const handleOk = () => {
  visible.value = false;
};

defineExpose({
  show,
});
</script>
