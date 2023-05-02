<template>
  <PageContainer>
    <div>
      <CommonTitleAction title="招投标项目管理">
        <template #right>
          <a-space>
            <a-button type="primary" @click="showDemandPage">需求转招标</a-button>
            <a-button type="primary" @click="showProjectPage">立项转招标</a-button>
            <a-button type="primary" @click="showDetail()">新建招标</a-button>
          </a-space>
        </template>
      </CommonTitleAction>
      <TableSearch
        ref="tableRef"
        :formItems="formItems"
        :formData="formData"
        :columns="columns"
        :scroll="{ x: 1580 }"
        :api="bidPage"
      >
        <template #cell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="showDetail(record, 1)">查看</a>
              <a v-if="record.status === 0" @click="showDetail(record, 2)">编辑</a>
              <a v-else @click="showDetail(record, 3)">查看进度</a>
            </a-space>
          </template>
          <template v-else-if="column.key === 'status'">
            <div class="align-center">
              <div :class="['approval', statusConfig(text).color]"></div>
              <span>{{ statusConfig(text).value }}</span>
            </div>
          </template>
          <template v-else-if="column.key === 'type'">{{ typeName(text) }}</template>
        </template>
      </TableSearch>
    </div>
  </PageContainer>
</template>

<script setup>
import { computed, ref } from 'vue';
import CommonTitleAction from '@/components/CommonTitleAction/index.vue';
import TableSearch from '@/components/TableSearch/index.vue';
import { bidPage } from '@/api/operator/bid';
import { useRouter } from 'vue-router';

const router = useRouter();

const formItems = ref([
  {
    type: 'text',
    label: '招标单号',
    value: 'id',
  },
  {
    type: 'text',
    label: '招标书标题',
    value: 'title',
  },
  {
    type: 'text',
    label: '企业名称',
    value: 'enterprise',
  },
  {
    type: 'select',
    label: '招标方式',
    value: 'type',
    options: [
      { label: '邀请', value: 0 },
      { label: '公开', value: 1 },
    ],
  },
  {
    type: 'select',
    label: '状态',
    value: 'status',
    options: [
      { label: '建标', value: 0 },
      { label: '投标中', value: 1 },
      { label: '投标截止', value: 2 },
      { label: '开标', value: 3 },
      { label: '评标中', value: 4 },
      { label: '定标', value: 5 },
      { label: '中标通知', value: 6 },
    ],
  },
]);

const formData = {
  id: undefined,
  title: undefined,
  enterprise: undefined,
  type: undefined,
  status: undefined,
};

const columns = [
  {
    title: '招标单号',
    dataIndex: 'id',
    width: 200,
  },
  {
    title: '招标项目',
    dataIndex: 'title',
    ellipsis: true,
    width: 180,
  },
  {
    title: '企业名称',
    dataIndex: 'enterprise',
    width: 180,
    ellipsis: true,
  },
  {
    title: '招标方式',
    dataIndex: ['bidRule', 'type'],
    key: 'type',
    width: 120,
  },
  {
    title: '预审截止时间',
    dataIndex: ['bidRule', 'qualifyEndTime'],
    width: 200,
  },
  {
    title: '投标开始时间',
    dataIndex: 'startTime',
    width: 200,
  },
  {
    title: '投标截止时间',
    dataIndex: 'endTime',
    width: 200,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 120,
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    width: 180,
  },
];

const statusConfig = computed(() => {
  return (value) => {
    return (
      [
        { value: '建标', color: 'approval-1' },
        { value: '投标中', color: 'approval2' },
        { value: '投标截止', color: 'approval2' },
        { value: '开标', color: 'approval2' },
        { value: '评标中', color: 'approval0' },
        { value: '定标', color: 'approval1' },
        { value: '中标通知', color: 'approval1' },
      ][value] || { value: '-' }
    );
  };
});

const typeName = computed(() => {
  return (value) => {
    return ['邀请', '公开'][value] || '-';
  };
});

const showDemandPage = () => {
  router.push({ path: '/purchasingManagement/bidding-demand-list' });
};

const showProjectPage = () => {
  router.push({ path: '/purchasingManagement/bidding-project-list' });
};

const showDetail = (record, type) => {
  if (record) {
    if (record.status === 0 || type === 1) {
      // 建标可看具体详情
      router.push({ path: `/purchasingManagement/bidding-list/${type}/${record.id}` });
    } else {
      // 查看开标详情
      router.push({ path: `/purchasingManagement/bidding-list/process/${record.id}` });
    }
  } else {
    router.push({ path: `/purchasingManagement/bidding-list/add` });
  }
};
</script>

<style lang="less" scoped>
.approval {
  position: relative;
  // padding-left: 16px;
  margin-right: 5px;
  width: 12px;
  height: 12px;
  border-radius: 3px;

  &::before {
    content: ' ';
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    left: 0px;
    top: 0px;
    right: 0;
    bottom: 0;
    margin: auto;
  }
}

.approval0 {
  border: 1px solid #1b77ff;

  &::before {
    background: #1b77ff;
  }
}

.approval1 {
  &:before {
    background: #52c41a;
  }
}

.approval2 {
  &:before {
    background: #f22933;
  }
}
.approval-1 {
  &:before {
    background: rgba(0, 0, 0, 0.85);
  }
}
</style>
