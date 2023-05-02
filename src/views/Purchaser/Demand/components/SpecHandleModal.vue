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
      <a-form-item label="编号" name="categoryId" style="display: none">
        <a-input v-model:value="formState.categoryId" disabled />
      </a-form-item>
      <a-form-item label="编号" name="type" style="display: none">
        <a-input v-model:value="formState.type" disabled />
      </a-form-item>

      <a-form-item label="规格名称" name="specKey">
        <a-input v-model:value="formState.specKey" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="规格值" name="specValue">
        <a-input v-model:value="formState.specValue" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="显示排序" name="sort">
        <a-input-number
          :precision="0"
          :min="0"
          :max="99999"
          v-model:value="formState.sort"
          placeholder="请输入"
          style="width: 100%"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { categorySpecAdd, categorySpecEdit } from '@/api/operator/demand.js';
import { reactive, ref, getCurrentInstance } from 'vue';

export default {
  name: 'SpecHandleModal',
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const formRef = ref();
    const formState = reactive({
      title: '',
      id: undefined,
      categoryId: undefined,
      specKey: '',
      specValue: '',
      sort: 0,
    });
    const rules = {
      specKey: [{ required: true, message: '请输入' }],
      specValue: [{ required: true, message: '请输入' }],
      sort: [{ required: true, message: '请输入' }],
    };

    const loading = ref(false);
    const visible = ref(false);

    const show = (item) => {
      visible.value = true;
      Object.keys(formState).forEach((key) => {
        formState[key] = item[key] || undefined;
      });
      formState.sort = item.sort || 0;
    };

    // 按钮操作
    const handleCancel = () => {
      formRef.value.resetFields();
      visible.value = false;
    };
    const handleOk = () => {
      formRef.value.validateFields().then((values) => {
        loading.value = true;
        const api = values.id ? categorySpecEdit : categorySpecAdd;
        const content = values.id ? '修改成功' : '新增成功';
        api(values)
          .then((res) => {
            proxy.$message.success(content);
            emit('finish', values.id ? { ...values } : { ...values, id: res });
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
      show,
      handleCancel,
      handleOk,
    };
  },
};
</script>
