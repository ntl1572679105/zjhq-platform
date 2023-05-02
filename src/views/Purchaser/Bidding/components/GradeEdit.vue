<template>
  <a-skeleton active :loading="loading">
    <CommonPMTable
      :columns="columns"
      rowKey="pid"
      v-model:data="state.list"
      addButtonText="新增评分要素"
      @cellAdd="addGrade"
      :showAddButton="!canDisabled"
    >
      <template #cell="{ column, record, index, text }">
        <template v-if="column.key === 'type'">
          <a-select
            v-model:value="record.type"
            :options="state.typeOptions"
            :disabled="canDisabled"
            placeholder="请选择"
            style="width: 100%"
          />
        </template>
        <template v-else-if="column.key === 'isNeed'">
          <a-select
            v-model:value="record.isNeed"
            :options="state.needOptions"
            :disabled="canDisabled"
            placeholder="请选择"
            style="width: 100%"
          />
        </template>
        <template v-else-if="column.key === 'number'">
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
      </template>
    </CommonPMTable>
  </a-skeleton>
</template>

<script setup>
import CommonPMTable from '@/components/CommonPMTable/index.vue';
import { ref, getCurrentInstance, onMounted, reactive } from 'vue';
import { getGradePartTypeDict } from '@/api/common';

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
    title: '要素编码',
    dataIndex: 'pid',
    width: '16%',
  },
  {
    title: '要素名称',
    key: 'input',
    dataIndex: 'name',
    width: '12%',
  },
  {
    title: '最低分',
    dataIndex: 'minScore',
    key: 'number',
    width: '12%',
  },
  {
    title: '最高分',
    dataIndex: 'maxScore',
    key: 'number',
    width: '12%',
  },
  {
    title: '合格分值',
    dataIndex: 'qualifiedScore',
    key: 'number',
    width: '12%',
  },
  {
    title: '要素权重%',
    dataIndex: 'weight',
    key: 'number',
    width: '12%',
  },
  {
    title: '必要通过标识',
    key: 'isNeed',
    width: '12%',
  },
  {
    title: '评分要素类型',
    key: 'type',
    width: '12%',
  },
];

const state = reactive({
  typeOptions: [], // 评分类别
  needOptions: [
    { label: '否', value: 0 },
    { label: '是', value: 1 },
  ],
  list: props.data.map((item) => ({ ...item, pid: item.id })), // 列表数据
});

const loading = ref(false);
onMounted(() => {
  loading.value = true;
  getGradePartTypeDict()
    .then((res) => {
      state.typeOptions = res.map((item) => ({
        label: item.dictKey,
        value: item.dictKey,
      }));
    })
    .finally(() => {
      loading.value = false;
    });
});

// 添加一列/删除
const addGrade = () => {
  state.list.push({
    pid: new Date().getTime(),
    name: '',
    minScore: '',
    maxScore: '',
    qualifiedScore: '',
    weight: '',
    isNeed: undefined,
    type: undefined,
  });
};

const validate = () => {
  const keys = ['name', 'minScore', 'maxScore', 'qualifiedScore', 'weight', 'isNeed', 'type'];
  return new Promise((resolve, reject) => {
    if (state.list && state.list.length > 0) {
      for (let i = 0; i < state.list.length; i++) {
        const element = state.list[i];
        for (let j = 0; j < keys.length; j++) {
          const value = element[keys[j]];
          const isEmpty = value == null || value === '';
          if (isEmpty) {
            console.log(`请完善评分要素信息-${keys[j]}-${value}`);
            proxy.$message.warning('请完善评分要素信息');
            reject();
            return;
          }
        }
      }
      resolve(state.list);
    } else {
      proxy.$message.warning('评分要素不能为空');
      reject();
    }
  });
};

defineExpose({
  validate,
});
</script>

<style lang="less" scoped></style>
