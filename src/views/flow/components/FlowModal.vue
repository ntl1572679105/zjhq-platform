<template>
  <a-modal
    v-model:visible="visible"
    :title="formState.title"
    @cancel="handleCancel"
    :destroy-on-close="true"
    :width="600"
    @ok="handleOk"
  >
    <template #footer>
      <a-button key="back" @click="handleCancel"> 取消</a-button>
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

      <a-form-item label="流程名称" name="name">
        <a-input v-model:value="formState.name" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="流程key" name="definitionKey">
        <a-input
          v-model:value="formState.definitionKey"
          placeholder="请输入"
          :disabled="formState.id ? true : false"
        />
      </a-form-item>
      <a-form-item label="状态" name="status">
        <a-switch v-model:checked="formState.status" :checkedValue="1" :unCheckedValue="0" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { processAdd, processEdit } from '@/api/flow';
import { reactive, ref, getCurrentInstance } from 'vue';

export default {
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const formRef = ref();
    const mapRef = ref(null);
    const formState = reactive({
      title: '',
      id: undefined,
      name: '',
      definitionKey: '',
      status: 0,
    });
    const rules = {
      name: [{ required: true, message: '请输入' }],
      definitionKey: [{ required: true, message: '请输入' }],
    };

    const loading = ref(false);
    const visible = ref(false);

    const show = (item) => {
      visible.value = true;
      Object.keys(formState).forEach((key) => {
        formState[key] = item[key] ?? undefined;
      });
      formState.status = item.status || 0;
    };

    // 按钮操作
    const handleCancel = () => {
      formRef.value.resetFields();
      visible.value = false;
    };
    const handleOk = () => {
      formRef.value.validateFields().then((values) => {
        loading.value = true;
        const api = values.id ? processEdit : processAdd;
        const content = values.id ? '修改成功' : '新增成功';
        api(values)
          .then(() => {
            proxy.$message.success(content);
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
      mapRef,
      formState,
      rules,
      loading,
      visible,
      show,
      handleCancel,
      handleOk,
    };
  },
};
</script>
