<template>
  <a-modal
    v-model:visible="visible"
    title="回复"
    @cancel="handleCancel"
    :destroy-on-close="true"
    :width="800"
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
      <a-form-item label="编号" name="bidId" style="display: none">
        <a-input v-model:value="formState.bidId" disabled />
      </a-form-item>
      <a-form-item label="联系人" name="linkman">
        <a-input v-model:value="formState.linkman" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="联系方式" name="phone">
        <a-input v-model:value="formState.phone" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="问题描述" name="description">
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
import { reactive, ref, getCurrentInstance } from 'vue';
import { bidQuestion } from '@/api/supplier/bid';

export default {
  setup(props, { emit }) {
    const formRef = ref();
    const formState = reactive({
      bidId: undefined,
      linkman: '',
      phone: '',
      description: '',
    });
    const rules = {
      linkman: [{ required: true, message: '请输入' }],
      phone: [{ required: true, message: '请输入' }],
      description: [{ required: true, message: '请输入' }],
    };

    const { proxy } = getCurrentInstance();
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
        bidQuestion(values)
          .then(() => {
            proxy.$message.success('提议成功');
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
      show,
      handleCancel,
      handleOk,
    };
  },
};
</script>

<style lang="less" scoped></style>
