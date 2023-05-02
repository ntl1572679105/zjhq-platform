<template>
  <header class="header-container">
    <div class="header-box">
      <!-- <RouterLink to="/"> -->
      <div class="title-box">
        <span style="color: #11d688">BuildX</span>
        <span>Key</span>
      </div>
      <!-- </RouterLink> -->
<!--      <SettingSelect-->
<!--        :tips="$t('setting.lang.tips')"-->
<!--        :value="languageSetting.value"-->
<!--        :list="languageSetting.list"-->
<!--        className="_r_select_use-1"-->
<!--        @chooseFn="chooseeLange"-->
<!--      />-->
    </div>
  </header>
</template>

<script setup>
// import { useRouter, RouterLink } from 'vue-router';
import SettingSelect from '../SettingSelect/index.vue';
import { localeList } from '@/locales/config.js';
import store from '@/store';
import { useLocale } from '@/locales/useLocales.js';

const languageSetting = {
  value: localeList.find((item) => item.lang === store.getters.lang).name, // '简体中文',
  list: localeList,
};

const { changeLocale } = useLocale();
const chooseeLange = (item) => {
  changeLocale(item.lang);
  // location.reload();
};
</script>

<style lang="less" scoped>
.header-container {
  width: 100vw;
  height: 76px;
  background: #131c25;
  z-index: 19;

  .header-box {
    width: 1350px;
    height: 100%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .title-box {
    font-size: 32px;
    font-family: Roboto-Bold, Roboto;
    font-weight: bold;
    color: #ffffff;
    line-height: 38px;
  }
}
</style>
