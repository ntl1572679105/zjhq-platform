<template>
  <a-modal
    v-model:visible="visible"
    :title="$t('menu.system.resetPwd')"
    @cancel="handleCancel"
    :destroy-on-close="true"
    :width="600"
    @ok="handleOk"
  >
    <template #footer>
      <a-button key="back" @click="handleCancel"> {{ $t('global.cancel') }} </a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="handleOk">{{
        $t('gloabl.submit')
      }}</a-button>
    </template>
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="{ xs: 24, md: 5 }"
      :wrapper-col="{ xs: 24, md: 18 }"
      label-align="right"
    >
      <p style="text-align: center">
        {{ $t('menu.system.resetPwd.input', { name: formState.userName }) }}
      </p>
      <a-form-item :label="$t('table.column.id')" name="id" style="display: none">
        <a-input v-model:value="formState.id" disabled />
      </a-form-item>

      <a-form-item :label="$t('menu.system.newPassword')" name="password">
        <a-input
          v-model:value="formState.password"
          :placeholder="$t('form.search.input-placeholder')"
          style="width: 80%"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { userReset } from '@/api/user.js';
import { reactive, ref, getCurrentInstance } from 'vue';
import { useI18n } from 'vue-i18n';

export default {
  setup(props, { emit }) {
    const { t } = useI18n();
    const { proxy } = getCurrentInstance();
    const formRef = ref();
    const mapRef = ref(null);
    const formState = reactive({
      password: '',
      userName: '',
      id: undefined,
    });
    const rules = {
      password: [{ required: true, message: t('form.search.input-placeholder') }],
    };

    const loading = ref(false);
    const visible = ref(false);

    const show = (item) => {
      visible.value = true;
      Object.keys(formState).forEach((key) => {
        formState[key] = item[key] || undefined;
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
        userReset(values)
          .then(() => {
            proxy.$message.success(t('menu.system.resetPwd.success'));
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

<style lang="less" scoped></style>
