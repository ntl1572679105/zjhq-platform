<template>
  <a-modal
    v-model:visible="visible"
    title="需求分配"
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
      <a-form-item label="分配对象" name="type">
        <a-select
          placeholder="请选择"
          v-model:value="formState.type"
          :options="typeOptions"
          @change="typeChange"
        ></a-select>
      </a-form-item>

      <a-form-item v-if="formState.type === 0" label="招标人" name="acceptUserId">
        <a-select
          v-model:value="formState.acceptUserId"
          placeholder="请选择"
          :options="userOptions"
        ></a-select>
      </a-form-item>
      <a-form-item v-else-if="formState.type === 1" label="机构" name="acceptAgentId">
        <a-select
          v-model:value="formState.acceptAgentId"
          placeholder="请选择"
          :options="agentOptions"
        ></a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { demandAssign } from '@/api/operator/demand.js';
import { userList } from '@/api/erp/common';
import { agentAll } from '@/api/common';
import { reactive, ref, getCurrentInstance } from 'vue';

export default {
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const formRef = ref();
    const formState = reactive({
      id: undefined,
      type: undefined,
      acceptUserId: undefined,
      acceptAgentId: undefined,
    });
    const rules = {
      type: [{ required: true, message: '请选择' }],
      acceptUserId: [{ required: true, message: '请选择' }],
      acceptAgentId: [{ required: true, message: '请选择' }],
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
      { label: '招标人', value: 0 },
      { label: '代理机构', value: 1 },
    ];
    const typeChange = (value, option) => {
      formState.acceptUserId = undefined;
      formState.acceptAgentId = undefined;
      if (value === 0) {
        getUserList();
      } else if (value === 1) {
        getAgentAll();
      }
    };

    const userOptions = ref([]);
    const getUserList = () => {
      if (userOptions.value.length > 0) return;
      userList().then((res) => {
        userOptions.value = res.map((item) => ({ label: item.userName, value: item.id }));
      });
    };

    const agentOptions = ref([]);
    const getAgentAll = () => {
      if (agentOptions.value.length > 0) return;
      agentAll().then((res) => {
        agentOptions.value = res.map((item) => ({ label: item.name, value: item.id }));
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
        demandAssign(values)
          .then(() => {
            proxy.$message.success('分配成功');
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
      typeChange,
      userOptions,
      agentOptions,
      show,
      handleCancel,
      handleOk,
    };
  },
};
</script>
