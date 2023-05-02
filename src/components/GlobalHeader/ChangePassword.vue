<template>
  <a-modal
    v-model:visible="visible"
    :title="$t('global.login.password.change')"
    @cancel="handleCancel"
    :destroy-on-close="true"
    :width="600"
    @ok="handleOk"
  >
    <template #footer>
      <a-button key="back" @click="handleCancel"> {{ $t('global.cancel') }} </a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="handleOk">{{ $t('gloabl.submit') }}</a-button>
    </template>
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="{ span: currentLang==='zh_CN'?5:8 }"
      :wrapper-col="{ span: 18 }"
      label-align="right"
    >
      <a-form-item :label="$t('global.login.password.current')" name="oldPassword">
        <a-input-password
          v-model:value="formState.oldPassword"
          :max-length="30"
          :placeholder="$t('global.login.password.inputCurrent')"
        />
      </a-form-item>
      <a-form-item :label="$t('global.login.password.new')" name="newPassword">
        <a-input-password
          :max-length="30"
          oninput="value=value.replace(/[\W]/g,'')"
          onpaste="return false"
          v-model:value="formState.newPassword"
          :placeholder="$t('global.login.password.inputNew')"
        />
      </a-form-item>
      <a-form-item :label="$t('global.login.password.confirmNew')" name="renewPassword">
        <a-input-password
          oninput="value=value.replace(/[\W]/g,'')"
          onpaste="return false"
          :max-length="30"
          v-model:value="formState.renewPassword"
          :placeholder="$t('global.login.password.inputNew.again')"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { changePassword } from '@/api/login.js';
import { reactive, ref, getCurrentInstance,computed } from 'vue';
import {useI18n} from "vue-i18n";
import store from "@/store";
export default {
  setup() {
    const {proxy} = getCurrentInstance();
    const {t} = useI18n()
    const formRef = ref();
    const currentLang = computed(()=>{
      return store.getters.lang
    })
    let formState = reactive({
      oldPassword: '',
      newPassword: '',
      renewPassword: '',
    });

    const validatePass2 = async (_rule, value) => {
      if (value === '') {
        return Promise.reject(t('global.login.password.input.again'));
      } else if (value !== formState.newPassword) {
        console.log(value, formState.newPassword);
        return Promise.reject(t('global.login.password.differ'));
      } else {
        return Promise.resolve();
      }
    };
    const rules = {
      oldPassword: [{ required: true, message: t('global.login.password.inputCurrent') }],
      newPassword: [
        { required: true, message: t('global.login.password.inputNew') },
        //   { validator: this.validatoruserPWD, trigger: 'blur' }
      ],
      renewPassword: [
        { required: true, message: t('global.login.password.inputNew.again') },
        { validator: validatePass2, trigger: 'blur' },
      ],
    };

    const loading = ref(false);
    const visible = ref(false);

    const show = () => {
      visible.value = true;
    };
    const handleCancel = () => {
      formState = {};
      visible.value = false;
    };
    const handleOk = () => {
      formRef.value.validateFields().then((values) => {
        loading.value = true;
        changePassword(values)
          .then(() => {
            proxy.$message.success(t('global.modify.success'));
            return proxy.$store.dispatch('Logout').then(() => {
              proxy.$router.push({ name: 'login' });
            });
          })
          .catch(() => {
            loading.value = false;
          });
      });
    };

    return { currentLang,formRef, formState, rules, loading, visible, show, handleCancel, handleOk };
  },
};
</script>

<style></style>
