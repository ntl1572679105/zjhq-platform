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
    title: '认证服务品类',
    dataIndex: 'categoryName',
    width: '20%',
    align: 'center',
    ellipsis: true,
  },
  {
    title: '认证有效期',
    dataIndex: 'calibrateTime',
    width: '20%',
    align: 'center',
    ellipsis: true,
  },
  {
    title: '中标项目编号',
    dataIndex: 'id',
    width: '20%',
    align: 'center',
    ellipsis: true,
  },
  {
    title: '中标项目名称',
    dataIndex: 'title',
    width: '20%',
    align: 'center',
    ellipsis: true,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: '20%',
    align: 'center',
    ellipsis: true,
  },
];
</script>

<style lang="less" scoped></style>
