<template>
  <CommonPMTable
    :columns="columns"
    rowKey="pid"
    v-model:data="dataSource"
    addButtonText="新增规格"
    @cellAdd="skuAdd"
    style="width: 100%; padding: 0 20px 20px 20px"
    :showAddButton="!canDisabled"
  >
    <template #cell="{ column, index, record, text }">
      <template v-if="column.key === 'input'">
        <a-input
          :disabled="canDisabled"
          :placeholder="canDisabled ? '-' : '请输入'"
          v-model:value="record[column.dataIndex]"
        />
      </template>
      <template v-if="column.key === 'number'">
        <a-input-number
          :disabled="canDisabled"
          placeholder="请输入"
          v-model:value="record[column.dataIndex]"
          style="width: 100%"
        />
      </template>
    </template>
  </CommonPMTable>
</template>

<script setup>
import CommonPMTable from '@/components/CommonPMTable/index.vue';
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
    title: '规格名称',
    dataIndex: 'skuKey',
    key: 'input',
  },
  {
    title: '规格值',
    dataIndex: 'skuValue',
    key: 'input',
  },
  {
    title: '排序',
    dataIndex: 'sort',
    key: 'number',
  },
  {
    title: '含税价格',
    dataIndex: 'taxPrice',
    key: 'number',
  },
  {
    title: '税点',
    dataIndex: 'taxPoint',
    key: 'number',
  },
];

const dataSource = ref(
  props.data.map((item) => ({
    pid: item.id,
    skuKey: item.attributeDTO.key,
    skuValue: item.attributeDTO.value,
    ...item,
    attributeDTO: undefined,
  })),
);

// 添加一列/删除
const skuAdd = () => {
  dataSource.value.push({
    pid: new Date().getTime(),
    skuKey: '',
    skuValue: '',
    sort: '',
    taxPrice: '',
    taxPoint: '',
  });
};

const validate = () => {
  console.log(dataSource.value);
  const keys = ['skuKey', 'skuValue', 'sort', 'taxPrice', 'taxPoint'];
  return new Promise((resolve, reject) => {
    if (dataSource.value && dataSource.value.length > 0) {
      for (let i = 0; i < dataSource.value.length; i++) {
        const element = dataSource.value[i];
        for (let j = 0; j < keys.length; j++) {
          const value = element[keys[j]];
          const isEmpty = value == null || value === '';
          if (isEmpty) {
            console.log(`规格信息-${keys[j]}-${value}`);
            proxy.$message.warning('请完善规格信息');
            reject();
            return;
          }
        }
      }
      resolve(dataSource.value);
    } else {
      proxy.$message.warning('规格不能为空');
      reject();
    }
  });
};

defineExpose({
  validate,
});
</script>

<style lang="less" scoped></style>
