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

      <a-form-item label="配置类型" name="configType">
        <a-select
          v-model:value="formState.configType"
          placeholder="请选择"
          allowClear
          style="width: 100%"
          :options="options"
        />
      </a-form-item>
      <a-form-item label="配置名称" name="configName">
        <a-input v-model:value="formState.configName" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="配置键名" name="configKey">
        <a-input v-model:value="formState.configKey" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="配置键值" name="configValue">
        <a-input v-model:value="formState.configValue" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="备注" name="remark">
        <a-textarea
          v-model:value="formState.remark"
          :rows="4"
          placeholder="请输入"
          show-count
          :maxlength="300"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { configAdd, configEdit } from '@/api/erp/config.js';
import { reactive, ref, getCurrentInstance } from 'vue';

export default {
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const formRef = ref();
    const formState = reactive({
      title: '',
      id: undefined,
      configType: undefined,
      configName: '',
      configKey: '',
      configValue: '',
      remark: '',
    });
    const rules = {
      configType: [{ required: true, message: '请选择' }],
      configName: [{ required: true, message: '请输入' }],
      configKey: [{ required: true, message: '请输入' }],
      configValue: [{ required: true, message: '请输入' }],
    };

    const loading = ref(false);
    const visible = ref(false);
    const options = ref([
      { label: '系统内置', value: 0 },
      { label: '业务配置', value: 1 },
    ]);

    const show = (item) => {
      visible.value = true;
      Object.keys(formState).forEach((key) => {
        formState[key] = item[key] ?? undefined;
      });
    };

    // 按钮操作
    const handleCancel = () => {
      formRef.value.resetFields();
      visible.value = false;
    };
    const handleOk = () => {
      formRef.value.validateFields().then((values) => {
        loading.value = true;
        const api = values.id ? configEdit : configAdd;
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
      formState,
      rules,
      loading,
      visible,
      options,
      show,
      handleCancel,
      handleOk,
    };
  },
};
</script>
