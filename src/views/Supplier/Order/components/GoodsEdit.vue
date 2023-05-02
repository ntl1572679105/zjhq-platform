<template>
  <div style="padding: 0 33px 20px">
    <a-table
      ref="table"
      size="default"
      row-key="productId"
      :columns="columns"
      :data-source="dataSource"
      :pagination="false"
      :scroll="{ x: 1740 }"
    >
      <template #bodyCell="{ column, record, index, text }">
        <template v-if="column.key === 'number'">
          <a-input-number
            :min="0"
            :disabled="canDisabled"
            v-model:value="record[column.dataIndex]"
            :placeholder="canDisabled ? '-' : '请输入'"
            style="width: 100%"
          ></a-input-number>
        </template>
      </template>
    </a-table>
  </div>
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
    title: '序号',
    customRender: ({ index }) => `${index + 1}`,
    width: 60,
  },
  {
    title: '物料编码',
    dataIndex: 'categoryIds',
    width: 200,
    ellipsis: true,
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
    title: '参与竞价',
    dataIndex: 'biddingPrice',
    key: 'number',
    width: 150,
  },
  {
    title: '税率',
    dataIndex: 'taxRate',
    key: 'number',
    width: 150,
  },
];

const dataSource = ref(props.data);

const validate = () => {
  const keys = ['biddingPrice', 'taxRate'];
  return new Promise((resolve, reject) => {
    if (dataSource.value && dataSource.value.length > 0) {
      for (let i = 0; i < dataSource.value.length; i++) {
        const element = dataSource.value[i];
        for (let j = 0; j < keys.length; j++) {
          const value = element[keys[j]];
          const isEmpty = value == null || value === '';
          if (isEmpty) {
            console.log(`请完善竞价信息-${keys[j]}-${value}`);
            proxy.$message.warning('请完善竞价信息');
            reject();
            return;
          }
        }
      }
      resolve(dataSource.value);
    } else {
      proxy.$message.warning('竞价不能为空');
      reject();
    }
  });
};

defineExpose({
  validate,
});
</script>

<style lang="less" scoped></style>
