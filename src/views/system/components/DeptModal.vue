<template>
  <a-modal
    v-model:visible="visible"
    :title="formState.title"
    :closable="false"
    @cancel="handleCancel"
    :destroy-on-close="true"
    :width="600"
    @ok="handleOk"
  >
    <template #footer>
      <a-button key="back" @click="handleCancel">取消</a-button>
      <a-button key="submit" :loading="loading" type="primary" @click="handleOk">确定</a-button>
    </template>
    <a-form
      ref="formRef"
      :model="formState"
      :label-col="{ xs: 24, md: 5 }"
      :wrapper-col="{ xs: 24, md: 14 }"
      label-align="right"
    >
      <a-form-item label="序号" name="id" style="display: none">
        <a-input v-model:value="formState.id" />
      </a-form-item>
      <a-form-item label="父部门" name="parentId">
        <a-cascader
          v-model:value="formState.parentId"
          :options="listOptions"
          change-on-select
          placeholder="请选择"
        />
      </a-form-item>
      <a-form-item label="部门名称" name="name" :rules="{ required: true, message: '请输入' }">
        <a-input v-model:value="formState.name" placeholder="请输入"></a-input>
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
import { reactive, ref } from 'vue';
import { deptAdd, deptEdit } from '@/api/erp/dept.js';

export default {
  setup(props, { emit }) {
    const formRef = ref();

    const formState = reactive({
      title: '新增',
      id: undefined,
      parentId: null,
      name: '',
      sort: '',
      remark: '',
    });

    const listOptions = ref([]);

    const visible = ref(false);
    const loading = ref(false);

    const show = (item) => {
      visible.value = true;
      Object.keys(formState).forEach((key) => {
        formState[key] = item[key] ?? undefined;
      });

      if (item.ids) {
        formState.parentId = item.ids;
      } else {
        formState.parentId = null;
      }
      listOptions.value = item.list;
    };

    // 按钮操作
    const handleCancel = () => {
      formRef.value.resetFields();
      visible.value = false;
      emit('reset');
    };
    const handleOk = () => {
      formRef.value.validateFields().then((values) => {
        loading.value = true;
        const api = values.id ? deptEdit : deptAdd;
        const params = { ...values };
        if (values.parentId && values.parentId.length > 0) {
          params.parentId = values.parentId[values.parentId.length - 1];
        } else {
          params.parentId = 0;
        }
        api(params)
          .then((res) => {
            emit('finish', res);
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
      visible,
      loading,
      listOptions,
      show,
      handleCancel,
      handleOk,
    };
  },
};
</script>

<style lang="less" scoped>
.tips {
  font-size: 12px;
  color: gray;
}
</style>
