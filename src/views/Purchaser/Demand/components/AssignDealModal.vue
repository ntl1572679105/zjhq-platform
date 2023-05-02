<template>
  <a-modal
    v-model:visible="visible"
    title="需求受理"
    @cancel="handleCancel"
    :destroy-on-close="true"
    :width="600"
    @ok="handleOk"
  >
    <template #footer>
      <a-button key="back" @click="handleCancel"> 取消 </a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="handleOk">确定</a-button>
    </template>
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="{ xs: 24, md: 5 }"
      :wrapper-col="{ xs: 24, md: 14 }"
      label-align="right"
    >
      <a-form-item label="编号" name="id" style="display: none">
        <a-input v-model:value="formState.id" disabled />
      </a-form-item>
      <a-form-item label="受理方式" name="acceptWay">
        <a-select
          placeholder="请选择"
          v-model:value="formState.acceptWay"
          :options="typeOptions"
        ></a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { demandAccept } from '@/api/agent/demand';
import { reactive, ref, getCurrentInstance } from 'vue';

export default {
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const formRef = ref();
    const formState = reactive({
      id: undefined,
      acceptWay: undefined,
    });
    const rules = {
      acceptWay: [{ required: true, message: '请选择' }],
    };

    const loading = ref(false);
    const visible = ref(false);

    const show = (item) => {
      visible.value = true;
      Object.keys(formState).forEach((key) => {
        formState[key] = item[key] || undefined;
      });
    };

    const typeOptions = [
      { label: '转订单', value: 0 },
      // { label: '转询价', value: 1 },
      { label: '转招标', value: 2 },
    ];

    // 按钮操作
    const handleCancel = () => {
      formRef.value.resetFields();
      visible.value = false;
    };
    const handleOk = () => {
      formRef.value.validateFields().then((values) => {
        loading.value = true;
        demandAccept(values)
          .then(() => {
            proxy.$message.success('受理成功');
            emit('finish', values);
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
      rules,
      loading,
      visible,
      typeOptions,
      show,
      handleCancel,
      handleOk,
    };
  },
};
</script>
