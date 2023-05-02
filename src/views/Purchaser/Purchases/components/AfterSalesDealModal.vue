<template>
  <a-modal v-model:visible="visible" title="售后处理" :destroy-on-close="true" :width="600">
    <template #footer>
      <a-button key="back" @click="handleOperate(2)"> 拒绝 </a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="handleOperate(1)"
        >通过</a-button
      >
    </template>
    <a-form
      ref="formRef"
      :model="formState"
      :label-col="{ xs: 24, md: 5 }"
      :wrapper-col="{ xs: 24, md: 14 }"
      label-align="right"
      :rules="rules"
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
      <a-form-item label="处理人" name="handler">
        <a-input placeholder="请输入" v-model:value="formState.handler"></a-input>
      </a-form-item>
      <a-form-item label="处理备注" name="handlerRemark">
        <a-textarea
          v-model:value="formState.handlerRemark"
          :rows="4"
          placeholder="请输入"
          :maxlength="300"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { orderAfterSalesEdit } from '@/api/operator/order';
import { reactive, ref, getCurrentInstance, computed } from 'vue';

export default {
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const formRef = ref();
    const formState = reactive({
      id: undefined,
      type: '',
      reason: '',
      description: '',
      handler: '',
      handlerRemark: '',
    });

    const loading = ref(false);
    const visible = ref(false);

    const typeName = computed(() => {
      return (value) => {
        return ['仅退款', '退换货', '退货退款'][value] ?? '-';
      };
    });
    const rules = {
      handler: [{ required: true, message: '请输入' }],
    };

    const show = (item) => {
      visible.value = true;
      Object.keys(formState).forEach((key) => {
        formState[key] = item[key] ?? undefined;
      });
    };

    const handleOperate = (type) => {
      visible.value = false;
      formRef.value.validateFields().then((values) => {
        loading.value = true;
        const params = {
          status: type,
          handler: values.handler,
          handlerRemark: values.handlerRemark,
          id: formState.id,
        };
        orderAfterSalesEdit(params)
          .then(() => {
            proxy.$message.success('处理成功');
            emit('finish');
            visible.value = false;
          })
          .finally(() => {
            loading.value = false;
          });
      });
    };

    return {
      formRef,
      formState,
      loading,
      visible,
      typeName,
      rules,
      show,
      handleOperate,
    };
  },
};
</script>
