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
    title: '投标供应商',
    dataIndex: 'supplierName',
    width: '20%',
    align: 'center',
  },
  {
    title: '投标联系人',
    dataIndex: 'linkman',
    width: '15%',
    align: 'center',
  },
  {
    title: '联系电话',
    dataIndex: 'linkmanPhone',
    width: '20%',
    align: 'center',
  },
  {
    title: '投标状态',
    key: 'winStatus',
    dataIndex: 'winStatus',
    width: '10%',
    align: 'center',
  },
  {
    title: '文件递交时间',
    dataIndex: 'createTime',
    width: '20%',
    align: 'center',
  },
  {
    title: '投标文件',
    dataIndex: 'tenderAttachmentUrlListJson',
    key: 'file',
    width: '15%',
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
