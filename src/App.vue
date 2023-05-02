<template>
  <a-config-provider :locale="getAntdLocale">
    <router-view />
  </a-config-provider>
</template>

<script setup>
import { watchEffect } from 'vue';
import { useRoute } from 'vue-router';
// import { useI18n } from 'vue-i18n';
import { useLocale } from '@/locales/useLocales.js';

const route = useRoute();
// const { t } = useI18n();
const { getAntdLocale } = useLocale();

watchEffect(() => {
  if (route.meta?.title) {
    // 翻译网页标题
    // document.title = `${t(route.meta?.title)} - template`;
    document.title = `${route.meta?.title} - 省后勤`;
  }
});
</script>
