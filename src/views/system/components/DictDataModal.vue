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
      <a-form-item label="字典类型" name="dictTypeId" style="display: none">
        <a-input v-model:value="formState.dictTypeId" disabled />
      </a-form-item>
      <a-form-item label="字典键名" name="dictKey">
        <a-input v-model:value="formState.dictKey" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="字典键值" name="dictValue">
        <a-input v-model:value="formState.dictValue" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="排序" name="sort">
        <a-input-number
          :precision="0"
          v-model:value="formState.sort"
          placeholder="请输入"
          style="width: 100%"
        />
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
import { dictDataAdd, dictDataEdit } from '@/api/erp/dict';
import { reactive, ref, getCurrentInstance } from 'vue';

export default {
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const formRef = ref();
    const formState = reactive({
      title: '',
      id: undefined,
      dictTypeId: undefined,
      dictKey: '',
      dictValue: '',
      sort: '',
      remark: '',
    });
    const rules = {
      dictKey: [{ required: true, message: '请输入' }],
      dictValue: [{ required: true, message: '请输入' }],
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
        const api = values.id ? dictDataEdit : dictDataAdd;
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
      show,
      handleCancel,
      handleOk,
    };
  },
};
</script>
