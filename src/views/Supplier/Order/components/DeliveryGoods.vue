<template>
  <div style="padding: 0 13px 20px">
    <a-table
      ref="table"
      size="default"
      row-key="productId"
      :columns="columns"
      :data-source="data"
      :pagination="false"
      :scroll="{ x: 1520 }"
    >
      <template #bodyCell="{ column, index, record, text }">
        <template v-if="column.key === 'action'">
          <span v-if="record.deliveryNumber >= record.demand">已添加</span>
          <a-button type="link" :disabled="canDisabled" v-else @click="operateAdd(record)"
            >添加</a-button
          >
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup>
defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  canDisabled: {
    type: Boolean,
    default: false,
  },
});

const columns = [
  {
    title: '序号',
    customRender: ({ index }) => `${index + 1}`,
    width: 60,
  },
  {
    title: '物料编码',
    dataIndex: 'productId',
    width: 200,
  },
  {
    title: '物料名称',
    dataIndex: 'name',
    width: 200,
    ellipsis: true,
  },
  {
    title: '物料品牌',
    dataIndex: 'brand',
    width: 120,
    ellipsis: true,
  },
  {
    title: '物料规格',
    customRender: ({ record }) => (record.sku ? `${record.sku.key}：${record.sku.value}` : ''),
    width: 200,
    ellipsis: true,
  },
  {
    title: '物料单位',
    dataIndex: 'unit',
    width: 120,
  },
  {
    title: '需求数量',
    dataIndex: 'demand',
    width: 120,
  },
  {
    title: '需求日期',
    dataIndex: 'demandTime',
    width: 140,
  },
  {
    title: '历史价格',
    dataIndex: 'historyPrice',
    width: 120,
  },
  {
    title: '参考价格',
    dataIndex: 'referencePrice',
    width: 120,
  },
  {
    title: '送货单',
    key: 'action',
    width: 120,
  },
];

const emits = defineEmits(['addOrder']);

const operateAdd = (record) => {
  emits('addOrder', record);
};
</script>

<style lang="less" scoped></style>
