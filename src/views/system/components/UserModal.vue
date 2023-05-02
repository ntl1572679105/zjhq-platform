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

      <a-form-item label="手机号码" name="phone">
        <a-input v-model:value="formState.phone" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="用户名" name="userName">
        <a-input v-model:value="formState.userName" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="用户密码" name="password" v-if="!formState.id">
        <a-input-password v-model:value="formState.password" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="邮箱" name="email">
        <a-input v-model:value="formState.email" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="部门" name="deptIds">
        <a-cascader
          v-model:value="formState.deptIds"
          :options="deptOptions"
          :placeholder="'请选择'"
          changeOnSelect
        />
      </a-form-item>
      <a-form-item label="用户状态" name="status">
        <a-switch v-model:checked="formState.status" :checkedValue="0" :unCheckedValue="1" />
      </a-form-item>
      <a-form-item label="角色类型" name="roleIdList">
        <a-select
          mode="multiple"
          placeholder="请选择"
          v-model:value="formState.roleIdList"
          style="width: 100%"
        >
          <a-select-option v-for="(item, index) in roleOptions" :key="index" :value="item.id">
            {{ item.roleName }}
          </a-select-option>
        </a-select>
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
import { userAdd, userEdit } from '@/api/user.js';
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
      phone: '',
      userName: '',
      email: '',
      status: 0,
      roleIdList: [],
      deptIds: [],
      remark: '',
    });
    const rules = {
      phone: formRules('cellPhone'),
      email: formRules('cellEmail'),
      userName: [{ required: true, message: '请输入' }],
      status: [{ required: true, message: '请输入' }],
      password: [{ required: true, message: '请输入' }],
      roleIdList: [{ required: true, message: '请选择' }],
    };

    const loading = ref(false);
    const visible = ref(false);
    const roleOptions = ref([]);
    const deptOptions = ref([]);

    const show = (item, roles, depts) => {
      visible.value = true;
      Object.keys(formState).forEach((key) => {
        formState[key] = item[key] ?? undefined;
      });
      formState.status = item.status || 0;
      roleOptions.value = roles;
      deptOptions.value = depts;
    };

    // 按钮操作
    const handleCancel = () => {
      formRef.value.resetFields();
      visible.value = false;
    };
    const handleOk = () => {
      formRef.value.validateFields().then((values) => {
        loading.value = true;
        const api = values.id ? userEdit : userAdd;
        const content = values.id ? '修改成功' : '新增成功';
        values.deptId = values.deptIds ? values.deptIds.slice(-1)[0] : undefined;
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
      roleOptions,
      deptOptions,
      show,
      handleCancel,
      handleOk,
    };
  },
};
</script>
