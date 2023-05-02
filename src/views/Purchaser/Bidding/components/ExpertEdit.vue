<template>
  <a-skeleton active :loading="loading">
    <CommonPMTable
      :columns="columns"
      rowKey="pid"
      v-model:data="state.list"
      addButtonText="新增专家"
      @cellAdd="addExpert"
      :showAddButton="!canDisabled"
    >
      <template #cell="{ column, record, index, text }">
        <template v-if="column.key === 'expertId'">
          <a-select
            v-model:value="record.expertId"
            :options="state.userList"
            :disabled="canDisabled"
            placeholder="请选择"
            style="width: 100%"
            @change="(value, options) => expertChange(value, options, record)"
          />
        </template>
        <template v-else-if="column.key === 'gradeType'">
          <a-select
            v-model:value="record.gradeType"
            :options="state.gradeTypeOptions"
            :disabled="canDisabled"
            placeholder="请选择"
            style="width: 100%"
          />
        </template>
        <template v-else-if="column.key === 'scoreTemplateId'">
          <a-select
            v-model:value="record.scoreTemplateId"
            :options="state.templateList"
            :disabled="canDisabled"
            placeholder="请选择"
            style="width: 100%"
          />
        </template>
      </template>
    </CommonPMTable>
  </a-skeleton>
</template>

<script setup>
import CommonPMTable from '@/components/CommonPMTable/index.vue';
import { ref, getCurrentInstance, onMounted, reactive } from 'vue';
import { scoreTemplateList, getGradeTypeDict, expertList } from '@/api/common';

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
    title: '专家名称',
    key: 'expertId',
    width: '20%',
  },
  {
    title: '评分类别',
    key: 'gradeType',
    width: '20%',
  },
  {
    title: '联系电话',
    dataIndex: 'phone',
    width: '20%',
  },
  {
    title: '电子邮箱',
    dataIndex: 'email',
    width: '20%',
  },
  {
    title: '评分模版',
    key: 'scoreTemplateId',
    width: '20%',
  },
];

const state = reactive({
  templateList: [], // 评分模板
  gradeTypeOptions: [], // 评分类别
  userList: [], // 专家
  list: props.data.map((item) => ({ ...item, pid: item.expertId })), // 列表数据
});

const loading = ref(false);
onMounted(() => {
  loading.value = true;
  Promise.all([scoreTemplateList({ status: 1 }), getGradeTypeDict(), expertList()])
    .then((result) => {
      state.templateList = result[0].map((item) => ({ label: item.name, value: item.id }));
      state.gradeTypeOptions = result[1].map((item) => ({
        label: item.dictKey,
        value: item.dictKey,
      }));
      state.userList = result[2].map((item) => ({
        label: item.name,
        value: item.id,
        phone: item.phone,
        email: item.email,
      }));
    })
    .finally(() => {
      loading.value = false;
    });
});

const expertChange = (value, options, record) => {
  console.log(value, options);
  if (value) {
    //   record.pid = value.slice(-1)[0];
    record.phone = options.phone;
    record.email = options.email;
  } else {
    //   record.pid = new Date().getTime();
    record.phone = '';
    record.email = '';
  }
};

// 添加一列/删除
const addExpert = () => {
  state.list.push({
    pid: new Date().getTime(),
    expertId: undefined,
    gradeType: undefined,
    phone: '',
    email: '',
    scoreTemplateId: undefined,
  });
};

const validate = () => {
  const keys = ['expertId', 'scoreTemplateId'];
  return new Promise((resolve, reject) => {
    if (state.list && state.list.length > 0) {
      for (let i = 0; i < state.list.length; i++) {
        const element = state.list[i];
        for (let j = 0; j < keys.length; j++) {
          const value = element[keys[j]];
          if (!value) {
            console.log(`请完善专家信息-${keys[j]}-${value}`);
            proxy.$message.warning('请完善专家信息');
            reject();
            return;
          }
        }
      }
      resolve(state.list);
    } else {
      proxy.$message.warning('专家不能为空');
      reject();
    }
  });
};

defineExpose({
  validate,
});
</script>

<style lang="less" scoped></style>
