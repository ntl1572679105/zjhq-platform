<template>
  <a-table
    :columns="columns"
    rowKey="categoryId"
    :data-source="dataSource"
    :scroll="{ x: 2000 }"
    :pagination="false"
    style="padding: 0 13px 20px"
  >
    <template #bodyCell="{ column, record, index, text }">
      <template v-if="column.key === 'number'">
        <a-input-number
          :min="0"
          :disabled="canDisabled"
          v-model:value="record[column.dataIndex]"
          placeholder="请输入"
          style="width: 100%"
        ></a-input-number>
      </template>
      <template v-else-if="column.key === 'input'">
        <a-input
          :disabled="canDisabled"
          v-model:value="record[column.dataIndex]"
          :placeholder="canDisabled ? '-' : '请输入'"
        ></a-input>
      </template>
      <template v-else-if="column.key === 'deliverTime'">
        <a-date-picker
          v-model:value="record.deliverTime"
          style="width: 100%"
          placeholder="请选择"
          show-time
          :disabled="canDisabled"
          valueFormat="YYYY-MM-DD HH:mm:ss"
        />
      </template>
      <template v-else-if="column.key === 'isTransportation'">
        <a-select
          v-model:value="record.isTransportation"
          :options="options1"
          :disabled="canDisabled"
          placeholder="请选择"
          style="width: 100%"
        />
      </template>
      <template v-else-if="column.key === 'effectiveTime'">
        <a-range-picker
          style="width: 100%"
          v-model:value="record.effectiveTime"
          show-time
          valueFormat="YYYY-MM-DD HH:mm:ss"
          :disabled="canDisabled"
        />
      </template>
    </template>
  </a-table>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue';

const { proxy } = getCurrentInstance();
const props = defineProps({
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
    title: '商品编号',
    dataIndex: 'categoryId',
    width: 200,
  },
  {
    title: '商品名称',
    dataIndex: 'categoryName',
    ellipsis: true,
    width: 200,
  },
  {
    title: '商品规格',
    dataIndex: 'categorySpecs',
    ellipsis: true,
    width: 200,
  },
  {
    title: '商品下浮率',
    dataIndex: 'floatDownloadRate',
    key: 'number',
    width: 120,
  },
  {
    title: '税率',
    dataIndex: 'taxRateType',
    key: 'input',
    width: 120,
  },
  {
    title: '税率值(%)',
    dataIndex: 'taxRate',
    key: 'number',
    width: 120,
  },
  {
    title: '报价有效期',
    key: 'effectiveTime',
    width: 430,
  },
  {
    title: '承若交付日期',
    key: 'deliverTime',
    width: 240,
  },
  {
    title: '供货周期(天)',
    dataIndex: 'supplyCycle',
    key: 'number',
    width: 140,
  },
  {
    title: '是否含运费',
    key: 'isTransportation',
    width: 120,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'input',
    width: 180,
  },
];

const dataSource = ref(
  props.data.map((item) => ({
    ...item,
    effectiveTime: [item.effectiveStartTime, item.effectiveEndTime],
  })),
);

const options1 = [
  { label: '否', value: 0 },
  { label: '是', value: 1 },
];

const validate = () => {
  const keys = [
    'floatDownloadRate',
    'taxRateType',
    'taxRate',
    'effectiveTime',
    'deliverTime',
    'supplyCycle',
    'isTransportation',
  ];
  return new Promise((resolve, reject) => {
    if (dataSource.value && dataSource.value.length > 0) {
      for (let i = 0; i < dataSource.value.length; i++) {
        const element = dataSource.value[i];
        for (let j = 0; j < keys.length; j++) {
          const value = element[keys[j]];
          const isEmpty = value == null || value === '';
          if (isEmpty) {
            console.log(`请完善商品信息-${keys[j]}-${value}`);
            proxy.$message.warning('请完善商品信息');
            reject();
            return;
          }
        }
      }
      resolve(dataSource.value);
    } else {
      proxy.$message.warning('商品不能为空');
      reject();
    }
  });
};

defineExpose({
  validate,
});
</script>

<style lang="less" scoped></style>
