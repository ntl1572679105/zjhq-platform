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
      name="usermodal"
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
      <a-form-item label="编号" name="agentId" style="display: none">
        <a-input v-model:value="formState.agentId" disabled />
      </a-form-item>

      <a-form-item label="手机号码" name="phone">
        <a-input v-model:value="formState.phone" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="用户名" name="name">
        <a-input v-model:value="formState.name" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="用户密码" name="password" v-if="!formState.id">
        <a-input-password v-model:value="formState.password" placeholder="请输入" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { userAdd } from '@/api/operator/agent.js';
import { reactive, ref, getCurrentInstance } from 'vue';
import { formRules } from '@/utils/rules.js';

export default {
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const formRef = ref();
    const mapRef = ref(null);
    const formState = reactive({
      title: '',
      id: undefined,
      agentId: undefined,
      phone: '',
      name: '',
      password: '',
    });
    const rules = {
      phone: formRules('cellPhone'),
      name: [{ required: true, message: '请输入' }],
      password: [{ required: true, message: '请输入' }],
    };

    const loading = ref(false);
    const visible = ref(false);

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
        const api = values.id ? userAdd : userAdd;
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
