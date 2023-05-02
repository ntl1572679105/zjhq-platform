<template>
  <div class="main">
    <div class="title">
      <img src="@/assets/images/app-logo@2x.png" style="width: auto; height: 48px" alt="" />
    </div>
    <!-- <div class="tips">浙好淘集采平台</div> -->
    <img src="@/assets/images/logo_font@2x.png" class="logo-font" />
    <a-form
      class="user-layout-login"
      :model="formState"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
      <a-form-item
        name="loginName"
        :rules="[{ required: true, message: $t('global.login.input-account') }]"
      >
        <a-input
          size="large"
          type="text"
          :placeholder="$t('global.login.input-account')"
          v-model:value="formState.loginName"
        >
          <template #prefix>
            <img src="@/assets/images/login-user.png" alt="tips" />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item
        name="password"
        :rules="[{ required: true, message: $t('global.login.input-password') }]"
      >
        <a-input-password
          size="large"
          :placeholder="$t('global.login.input-password')"
          v-model:value="formState.password"
        >
          <template #prefix>
            <img src="@/assets/images/login-password.png" alt="tips" />
          </template>
        </a-input-password>
      </a-form-item>

      <a-form-item
        name="code"
        :rules="[{ required: true, message: $t('global.login.input-code') }]"
      >
        <a-input
          class="login-form-input"
          size="large"
          type="text"
          :placeholder="$t('global.login.input-code')"
          v-model:value="formState.code"
        >
          <template #suffix>
            <img class="code-img" :src="captchaImageInfo.img" alt="" @click="getCaptcha" />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item style="margin-top: 16px">
        <a-button
          size="large"
          html-type="submit"
          class="login-button"
          style="background: #1b7fff; color: #ffffff"
          :loading="loginState.loginBtn"
          :disabled="loginState.loginBtn"
        >
          {{ $t('global.login') }}
        </a-button>
      </a-form-item>
    </a-form>
    <!-- <div class="forgot" @click="forgot">{{ $t('global.login.forgetPassword') }}</div> -->
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, ref, getCurrentInstance, h } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { timeFix } from '@/utils/util';
import { getCaptchaImage } from '@/api/login.js';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  setup() {
    // store/router/实例对象 操作
    const { t } = useI18n();

    const { dispatch } = useStore();
    const router = useRouter();
    const { proxy } = getCurrentInstance();

    // form表单关联
    const formState = reactive({
      loginName: '',
      password: '',
      code: '',
    });

    // 对象
    const loginState = ref({
      time: 60,
      loginBtn: false,
    });
    const captchaImageInfo = ref({
      img: null,
      uuid: null,
    });

    // 表单验证通过
    const onFinish = (values) => {
      // console.log('success: ', values);
      loginState.value.loginBtn = true;
      const loginParams = {
        ...values,
        userType: 0,
        uuid: captchaImageInfo.value.uuid,
        appId: import.meta.env.VITE_APP_APP_ID,
      };
      dispatch('Login', loginParams)
        .then(() => {
          router.push({ path: '/' });
          // 延迟 1 秒显示欢迎信息
          setTimeout(() => {
            proxy.$notification.success({
              message: t('global.welcome'),
              description: `${t(timeFix())}，${t('global.welcomeBack')}`,
            });
          }, 1000);
        })
        .catch((err) => getCaptcha(err))
        .finally(() => {
          loginState.value.loginBtn = false;
        });
    };
    // 表单验证失败
    const onFinishFailed = (errorInfo) => {
      console.log('error: ', errorInfo);
    };

    // 获取验证码
    const getCaptcha = () => {
      getCaptchaImage({}).then((res) => {
        captchaImageInfo.value = { img: `data:image/png;base64,${res.img}`, uuid: res.uuid };
      });
    };

    // forgot
    const forgot = () => {
      // console.log(typeof t('global.login.forgetPassword-content2'),t('global.login.forgetPassword-content2'));
      proxy.$info({
        closable: true,
        title: t('global.login.forgetPassword-t'),
        content: h('div', {}, [
          h('div', t('global.login.forgetPassword-content')),
          h('div', `${t('global.login.forgetPassword-content2')}CS@usaeb5.com`),
          h('div', t('global.login.forgetPassword-content3')),
        ]),
      });
    };

    // 组件加载后处理
    onMounted(() => {
      getCaptcha();
    });

    // 返回操作对象
    return {
      loginState,
      captchaImageInfo,
      formState,
      onFinish,
      onFinishFailed,
      getCaptcha,
      forgot,
    };
  },
});
</script>

<style lang="less" scoped>
:deep(.ant-input-affix-wrapper-lg) {
  height: 40px;
  padding: 0 auto;
}
.main {
  width: 66%;
  display: flex;
  align-items: center;
  flex-direction: column;
  background: #ffffff;
  border-radius: 8px;
  .title {
    font-size: 22px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.9);
    line-height: 30px;
    padding-top: 40px;
  }
  .tips {
    margin-top: 13px;
    font-size: 20px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.7);
    line-height: 20px;
    margin-bottom: 35px;
  }
  .forgot {
    padding: 20px 0 56px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #1890ff;
    line-height: 22px;
    cursor: pointer;
  }
}
.user-layout-login {
  flex: 1;
  label {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .code-img {
    width: auto;
    height: 40px;
    cursor: pointer;
    transform: translate(12px, 0);
  }
}

.logo-font {
  width: 104px;
  height: 19px;
  margin: 28px;
}
</style>
