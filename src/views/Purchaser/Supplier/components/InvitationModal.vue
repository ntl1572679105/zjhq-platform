<template>
  <a-modal v-model:visible="visible" title="邀请" :destroy-on-close="true" :width="600">
    <template #footer>
      <a-button key="back" @click="handleOperate"> 关闭 </a-button>
    </template>
    <div>请复制该链接 {{ formState.url }} 给供应商，以便自身提交申请。</div>
  </a-modal>
</template>

<script>
import { reactive, ref } from 'vue';

export default {
  setup(props, { emit }) {
    const formRef = ref();
    const formState = reactive({
      url: '',
    });

    const visible = ref(false);

    const show = (item) => {
      visible.value = true;
      Object.keys(formState).forEach((key) => {
        formState[key] = item[key] || undefined;
      });
    };

    const handleOperate = () => {
      visible.value = false;
    };

    return {
      formRef,
      formState,
      visible,
      show,
      handleOperate,
    };
  },
};
</script>
