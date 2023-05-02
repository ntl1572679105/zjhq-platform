<template>
  <PageContainer>
    <div>
      <CommonTitleAction title="投标台" />
      <TableSearch
        ref="tableRef"
        :formItems="formItems"
        :formData="formData"
        :columns="columns"
        :scroll="{ x: 1440 }"
        :api="bidList"
      >
        <template #cell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="showDetail(record)">查看</a>
              <a v-if="record.status < 5" @click="showQuestion(record)">提议</a>
              <a v-if="record.status === 1 && record.isBid === 0" @click="showAdd(record)">投标</a>
            </a-space>
          </template>
          <template v-else-if="column.key === 'status'">
            <div class="align-center">
              <div :class="['approval', statusConfig(record).color]"></div>
              <span>{{ statusConfig(record).value }}</span>
            </div>
          </template>
        </template>
      </TableSearch>
      <QuestionModal ref="questionModal" />
    </div>
  </PageContainer>
</template>

<script setup>
import { computed, getCurrentInstance, ref } from 'vue';
import CommonTitleAction from '@/components/CommonTitleAction/index.vue';
import TableSearch from '@/components/TableSearch/index.vue';
import { bidList } from '@/api/supplier/bid';
import { useRouter } from 'vue-router';
import QuestionModal from './components/QuestionModal.vue';

const router = useRouter();
const { proxy } = getCurrentInstance();

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
    label: '状态',
    value: 'status',
    options: [
      { label: '待投标', value: 1 },
      { label: '待开标', value: 2 },
      { label: '开标', value: 3 },
      { label: '评标中', value: 4 },
      { label: '待定标', value: 5 },
      { label: '已结束', value: 6 },
    ],
  },
]);

const formData = {
  id: undefined,
  title: undefined,
  enterprise: undefined,
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
    width: 160,
  },
];

const statusConfig = computed(() => {
  return (value) => {
    if (value.status === 1) {
      return value.isBid === 0
        ? { value: '待投标', color: 'approval3' }
        : { value: '待开标', color: 'approval3' };
    } else if (value.status === 6) {
      return value.bidSupplier?.winStatus === 1
        ? { value: '已中标', color: 'approval1' }
        : { value: '已结束', color: 'approval2' };
    } else {
      return (
        [
          { value: '待投标', color: 'approval3' },
          { value: '待投标', color: 'approval3' },
          { value: '待开标', color: 'approval3' },
          { value: '开标', color: 'approval1' },
          { value: '评标中', color: 'approval1' },
          { value: '待定标', color: 'approval0' },
          { value: '已结束', color: 'approval2' },
        ][value.status] || { value: '-' }
      );
    }
  };
});

const showDetail = (record) => {
  router.push({ path: `/supplier/bidding-list/${record.id}` });
};

const showQuestion = (record) => {
  proxy.$refs.questionModal.show({ bidId: record.id });
};

const showAdd = (record) => {
  router.push({ path: `/supplier/bidding-list/add/${record.id}` });
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
.approval3 {
  &:before {
    background: #f38f1f;
  }
}
.approval-1 {
  &:before {
    background: rgba(0, 0, 0, 0.85);
  }
}
</style>
