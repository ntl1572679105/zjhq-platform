<template>
  <a-modal
    v-model:visible="visible"
    :title="state.title"
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
      <a-form-item label="资讯标题" name="title">
        <a-input
          v-model:value="formState.title"
          placeholder="请输入"
          :disabled="state.type === 1"
        />
      </a-form-item>
      <a-form-item label="资讯内容" name="remark">
        <a-textarea
          v-model:value="formState.remark"
          :rows="8"
          placeholder="请输入"
          show-count
          :maxlength="1000"
          :disabled="state.type === 1"
        />
      </a-form-item>
      <a-form-item label="启用状态" name="status">
        <a-switch
          v-model:checked="formState.status"
          :disabled="state.type === 1"
          :checkedValue="0"
          :unCheckedValue="1"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { informationAdd, informationEdit } from '@/api/operator/home';
import { reactive, ref, getCurrentInstance } from 'vue';

export default {
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const formRef = ref();
    const formState = reactive({
      id: undefined,
      status: 0,
      title: '',
      remark: '',
    });
    const rules = {
      title: [{ required: true, message: '请输入' }],
      remark: [{ required: true, message: '请输入' }],
    };

    const loading = ref(false);
    const visible = ref(false);
    const state = reactive({
      title: '',
      type: 0, // 0：新增 1：查看 2：编辑
    });

    const show = (item, type) => {
      visible.value = true;
      Object.keys(formState).forEach((key) => {
        formState[key] = item[key] ?? undefined;
      });
      state.type = type;
      state.title = ['新建资讯', '查看资讯', '编辑资讯'][type];
    };

    // 按钮操作
    const handleCancel = () => {
      formRef.value.resetFields();
      visible.value = false;
    };
    const handleOk = () => {
      formRef.value.validateFields().then((values) => {
        loading.value = true;
        const api = values.id ? informationEdit : informationAdd;
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
      state,
      show,
      handleCancel,
      handleOk,
    };
  },
};
</script>
