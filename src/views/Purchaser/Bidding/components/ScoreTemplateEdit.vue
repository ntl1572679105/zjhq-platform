<template>
  <CommonPMTable
    :columns="columns"
    rowKey="pid"
    v-model:data="dataSource"
    addButtonText="新增"
    @cellAdd="addScore"
    :showAddButton="!canDisabled"
  >
    <template #cell="{ column, record, index, text }">
      <template v-if="column.key === 'indexGroupName'">
        <a-input
          :disabled="canDisabled"
          v-model:value="record.indexGroupName"
          placeholder="请输入"
        ></a-input>
      </template>
      <template v-else-if="column.key === 'indexName'">
        <a-input
          :disabled="canDisabled"
          v-model:value="record.indexName"
          placeholder="请输入"
        ></a-input>
      </template>
      <template v-else-if="column.key === 'scoreCriteria'">
        <a-input
          :disabled="canDisabled"
          v-model:value="record.scoreCriteria"
          placeholder="请输入"
        ></a-input>
      </template>
      <template v-else-if="column.key === 'maxScore'">
        <a-input-number
          :min="0"
          :disabled="canDisabled"
          v-model:value="record.maxScore"
          placeholder="请输入"
          style="width: 100%"
        >
        </a-input-number>
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
  type: {
    // 类型 1-技术标 2-商务标
    type: Number,
    required: true,
  },
  canDisabled: {
    type: Boolean,
    default: false,
  },
});

const columns = [
  // {
  //   title: '编号',
  //   dataIndex: 'pid',
  //   width: 200,
  // },
  {
    title: '指标组名称',
    key: 'indexGroupName',
    width: '20%',
  },
  {
    title: '指标名称',
    key: 'indexName',
    width: '20%',
  },
  {
    title: '评分标准',
    key: 'scoreCriteria',
    width: '40%',
  },
  {
    title: '最高分',
    key: 'maxScore',
    width: '15%',
  },
];

const dataSource = ref(props.data.map((item) => ({ ...item, pid: item.id })));

// 添加一列/删除
const addScore = () => {
  dataSource.value.push({
    pid: new Date().getTime(),
    indexGroupName: '',
    indexName: '',
    scoreCriteria: '',
    maxScore: '',
    type: props.type,
  });
};

const validate = () => {
  const keys = ['indexGroupName', 'indexName', 'scoreCriteria', 'maxScore'];
  return new Promise((resolve, reject) => {
    if (dataSource.value && dataSource.value.length > 0) {
      for (let i = 0; i < dataSource.value.length; i++) {
        const element = dataSource.value[i];
        for (let j = 0; j < keys.length; j++) {
          const value = element[keys[j]];
          if (!value) {
            console.log(`请完善指标信息-${keys[j]}-${value}`);
            proxy.$message.warning('请完善指标信息');
            reject();
            return;
          }
        }
      }
      resolve(dataSource.value);
    } else {
      proxy.$message.warning('指标不能为空');
      reject();
    }
  });
};

defineExpose({
  validate,
});
</script>

<style lang="less" scoped></style>
