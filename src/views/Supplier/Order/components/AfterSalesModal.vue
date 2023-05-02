<template>
  <a-modal v-model:visible="visible" title="申请售后" :destroy-on-close="true" :width="600">
    <template #footer>
      <a-button key="back" @click="handleCancel"> 取消 </a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="handleOperate"
        >确定</a-button
      >
    </template>
    <a-form
      ref="formRef"
      :model="formState"
      :label-col="{ xs: 24, md: 5 }"
      :wrapper-col="{ xs: 24, md: 14 }"
      :rules="rules"
      label-align="right"
    >
      <a-form-item label="编号" name="orderBiddingId" style="display: none">
        <a-input v-model:value="formState.orderBiddingId" disabled />
      </a-form-item>

      <a-form-item label="售后类型" name="type">
        <a-select
          placeholder="请选择"
          v-model:value="formState.type"
          :options="typeOptions"
        ></a-select>
      </a-form-item>
      <a-form-item label="售后原因" name="reason">
        <a-select
          placeholder="请选择"
          v-model:value="formState.reason"
          :options="reasonOptions"
        ></a-select>
      </a-form-item>
      <a-form-item label="描述" name="description">
        <a-textarea
          v-model:value="formState.description"
          :rows="4"
          placeholder="请输入"
          :maxlength="300"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { orderAfterSalesAdd } from '@/api/supplier/order';
import { getReasonTypeDict } from '@/api/common';
import { reactive, ref, getCurrentInstance, onMounted } from 'vue';

export default {
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const formRef = ref();
    const formState = reactive({
      orderBiddingId: undefined,
      type: '',
      reason: '',
      description: '',
    });

    const loading = ref(false);
    const visible = ref(false);

    const rules = {
      type: [{ required: true, message: '请选择' }],
      reason: [{ required: true, message: '请选择' }],
    };

    const typeOptions = [
      { label: '仅退款', value: 0 },
      { label: '退换货', value: 1 },
      { label: '退货退款', value: 2 },
    ];

    const show = (item) => {
      visible.value = true;
      Object.keys(formState).forEach((key) => {
        formState[key] = item[key] || undefined;
      });
    };

    onMounted(() => {
      getList();
    });

    const reasonOptions = ref([]);
    const getList = () => {
      getReasonTypeDict().then((res) => {
        reasonOptions.value = res.map((item) => ({ label: item.dictKey, value: item.dictKey }));
      });
    };

    const handleCancel = () => {
      formRef.value.resetFields();
      visible.value = false;
    };

    const handleOperate = () => {
      visible.value = false;
      formRef.value.validateFields().then((values) => {
        loading.value = true;
        orderAfterSalesAdd(values)
          .then(() => {
            proxy.$message.success('新增成功');
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
      typeOptions,
      reasonOptions,
      rules,
      show,
      handleOperate,
      handleCancel,
    };
  },
};
</script>
