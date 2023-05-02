<template>
  <div style="padding: 0 33px 20px">
    <div class="mb-20 flex">
      <div class="mr-24 flex">
        <div class="mr-12">
          不含税价（元）：<span class="f-blod">{{ data.totalAmount }}</span>
        </div>
        <div>
          税率：<span class="f-blod">{{ data.taxRate }}</span
          >%
        </div>
      </div>
      <div>
        含税总金额（元）：<span class="f-blod">{{ data.taxTotalAmount }}</span>
      </div>
    </div>
    <a-table
      ref="table"
      size="default"
      row-key="productId"
      :columns="columns"
      :data-source="data.bidItems"
      :pagination="false"
      :scroll="{ x: 1620 }"
    >
    </a-table>
  </div>
</template>

<script setup>
defineProps({
  data: {
    type: Object,
    default: () => {},
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
  },
  {
    title: '物料品牌',
    dataIndex: 'brand',
    width: 120,
  },
  {
    title: '物料规格',
    customRender: ({ record }) => (record.sku ? `${record.sku.key}：${record.sku.value}` : ''),
    width: 200,
  },
  {
    title: '物料单位',
    dataIndex: 'unit',
    width: 120,
  },
  {
    title: '需求数量',
    dataIndex: 'demand',
    width: 160,
  },
  {
    title: '需求日期',
    dataIndex: 'demandTime',
    width: 200,
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
    title: '参与竞价',
    dataIndex: 'biddingPrice',
    width: 120,
  },
];
</script>

<style lang="less" scoped></style>
