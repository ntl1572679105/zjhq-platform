<template>
  <a-table
    :columns="columns"
    :dataSource="data"
    row-key="id"
    bordered
    :pagination="false"
    style="padding: 0 16px 20px"
  >
    <template #bodyCell="{ column, index, record, text }"> </template>
  </a-table>
</template>

<script setup>
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
    width: '40%',
    align: 'center',
  },
  {
    title: '开标记录',
    dataIndex: 'quoteAmount',
    width: '60%',
    align: 'center',
  },
];
</script>

<style lang="less" scoped></style>
