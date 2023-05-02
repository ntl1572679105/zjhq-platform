<template>
  <a-modal
    v-model:visible="visible"
    :title="state.title"
    :destroy-on-close="true"
    :width="1000"
    :bodyStyle="{ height: '70vh' }"
  >
    <template #footer>
      <a-button key="submit" type="primary" @click="handleOk">关闭</a-button>
    </template>
    <a-skeleton active :loading="state.loading">
      {{ state.detail.content }}
    </a-skeleton>
  </a-modal>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { messageDetail } from '@/api/message';

const visible = ref(false);
const state = reactive({
  loading: false,
  id: '',
  title: '',
  detail: {},
});

const show = (id, title) => {
  visible.value = true;
  state.loading = true;
  state.id = id;
  state.title = title;
  getDetail();
};

const getDetail = () => {
  messageDetail(state.id)
    .then((res) => {
      state.detail = res;
    })
    .finally(() => {
      state.loading = false;
    });
};

// 按钮操作
const handleOk = () => {
  visible.value = false;
};

defineExpose({
  show,
});
</script>

<style lang="less" scoped></style>
