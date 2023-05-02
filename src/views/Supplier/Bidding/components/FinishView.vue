<template>
  <a-table
    :columns="columns"
    :dataSource="data"
    row-key="id"
    bordered
    :pagination="false"
    style="padding: 0 16px 20px"
  >
    <template #bodyCell="{ column, index, record, text }">
      <template v-if="column.key === 'winStatus'">
        {{ statusName(text) }}
      </template>
      <template v-else-if="column.key === 'file'">
        <a v-if="text" :href="text" target="_blank">{{ text.split('/').pop() }}</a>
      </template>
    </template>
  </a-table>
</template>

<script setup>
import { computed } from 'vue';

defineProps({
  data: {
    type: Array,
    default: () => [],
  },
});

const columns = [
  {
    title: '中标情况',
    dataIndex: 'winStatus',
    key: 'winStatus',
    width: '30%',
    align: 'center',
  },
  {
    title: '中标通知书',
    dataIndex: 'winNotificationUrl',
    key: 'file',
    width: '30%',
    align: 'center',
  },
  {
    title: '备注',
    dataIndex: 'winRemark',
    width: '40%',
    align: 'center',
  },
];

const statusName = computed(() => {
  return (value) => {
    return ['未中标', '已中标'][value] ?? '-';
  };
});
</script>

<style lang="less" scoped></style>
