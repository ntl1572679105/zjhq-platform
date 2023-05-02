<template>
  <div v-for="(item, index) in data" :key="index">
    <CommonForm :formItems="formItems" :formData="item" :canDisabled="true" />
    <a-table
      :columns="columns"
      :dataSource="item.scoreList"
      row-key="supplierId"
      bordered
      :pagination="false"
      style="padding: 0 13px 20px"
    >
    </a-table>
  </div>
</template>

<script setup>
import CommonForm from '@/components/CommonForm/index.vue';

defineProps({
  data: {
    type: Array,
    default: () => [],
  },
});

const formItems = [
  {
    type: 'text',
    label: '评标专家',
    value: 'name',
    rules: true,
  },
  {
    type: 'text',
    label: '评标开始时间',
    value: 'beginTime',
    rules: true,
  },
  {
    type: 'text',
    label: '评标结束时间',
    value: 'endTime',
    rules: true,
  },
  {
    type: 'file',
    label: '评标报告',
    value: 'report',
    rules: true,
  },
  {
    type: 'file',
    label: '评审附件',
    value: 'attachment',
    rules: true,
  },
];

const columns = [
  {
    title: '投标供应商',
    dataIndex: ['supplier', 'name'],
    width: '40%',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '评分',
    dataIndex: 'totalScore',
    width: '30%',
    align: 'center',
  },
  {
    title: '评分建议',
    dataIndex: 'remark',
    width: '30%',
    ellipsis: true,
    align: 'center',
  },
];
</script>

<style lang="less" scoped></style>
