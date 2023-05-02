<template>
  <a-modal v-model:visible="visible" title="售后详情" :destroy-on-close="true" :width="600">
    <template #footer>
      <a-button type="primary" @click="handleOperate">关闭</a-button>
    </template>
    <a-form
      ref="formRef"
      :model="formState"
      :label-col="{ xs: 24, md: 5 }"
      :wrapper-col="{ xs: 24, md: 14 }"
      label-align="right"
    >
      <a-form-item label="售后类型" name="type">
        <span>{{ typeName(formState.type) }}</span>
      </a-form-item>
      <a-form-item label="售后原因" name="reason">
        <span>{{ formState.reason }}</span>
      </a-form-item>
      <a-form-item label="描述" name="description">
        <span>{{ formState.description || '-' }}</span>
      </a-form-item>
      <a-form-item label="状态" name="status">
        <span>{{ statusName(formState.status) }}</span>
      </a-form-item>
      <a-form-item v-if="formState.status !== 0" label="处理备注" name="handlerRemark">
        <span>{{ formState.handlerRemark || '-' }}</span>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { computed, reactive, ref } from 'vue';

export default {
  setup(props, { emit }) {
    const formRef = ref();
    const formState = reactive({
      id: '',
      type: '',
      reason: '',
      description: '',
      status: undefined,
      handlerRemark: '',
    });

    const visible = ref(false);

    const typeName = computed(() => {
      return (value) => {
        return ['仅退款', '退换货', '退货退款'][value] ?? '-';
      };
    });

    const statusName = computed(() => {
      return (value) => {
        return ['未处理', '已通过', '未通过'][value] ?? '-';
      };
    });

    const show = (item) => {
      visible.value = true;
      Object.keys(formState).forEach((key) => {
        formState[key] = item[key] ?? undefined;
      });
    };

    const handleOperate = () => {
      visible.value = false;
    };

    return {
      formRef,
      formState,
      visible,
      typeName,
      statusName,
      show,
      handleOperate,
    };
  },
};
</script>
