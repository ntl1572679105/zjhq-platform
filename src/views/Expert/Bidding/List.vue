<template>
  <PageContainer>
    <div>
      <CommonTitleAction title="评标列表" />
      <TableSearch
        ref="tableRef"
        :formItems="formItems"
        :formData="formData"
        :columns="columns"
        :scroll="{ x: 1400 }"
        :api="bidList"
      >
        <template #cell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="showDetail(record, 1)">查看</a>
              <a v-if="record.status == 0" @click="showDetail(record, 2)">评标</a>
            </a-space>
          </template>
          <template v-else-if="column.key === 'status'">
            <div class="align-center">
              <div :class="['approval', statusConfig(text).color]"></div>
              <span>{{ statusConfig(text).value }}</span>
            </div>
          </template>
        </template>
      </TableSearch>
    </div>
  </PageContainer>
</template>

<script setup>
import { computed, ref } from 'vue';
import CommonTitleAction from '@/components/CommonTitleAction/index.vue';
import TableSearch from '@/components/TableSearch/index.vue';
import { bidList } from '@/api/expert/bid';
import { useRouter } from 'vue-router';

const router = useRouter();

const formItems = ref([
  {
    type: 'text',
    label: '项目编号',
    value: 'bidId',
  },
  {
    type: 'text',
    label: '项目标题',
    value: 'title',
  },
  {
    type: 'select',
    label: '状态',
    value: 'status',
    options: [
      { label: '未评标', value: 0 },
      { label: '已评标', value: 1 },
    ],
  },
  {
    type: 'datepicker',
    label: '开标时间',
    value: 'startBidOpenTime',
    valueFormat: 'YYYY-MM-DD',
  },
  {
    type: 'datepicker',
    label: '通知时间',
    value: 'startNoticeTime',
    valueFormat: 'YYYY-MM-DD',
  },
]);

const formData = {
  bidId: undefined,
  title: undefined,
  startBidOpenTime: undefined,
  startNoticeTime: undefined,
  status: undefined,
};

const columns = [
  {
    title: '项目编号',
    dataIndex: 'bidId',
    width: 200,
  },
  {
    title: '项目标题',
    dataIndex: ['bid', 'title'],
    ellipsis: true,
    width: 180,
  },
  {
    title: '评标时间',
    dataIndex: 'beginTime',
    width: 200,
  },
  {
    title: '通知时间',
    dataIndex: ['bid', 'startTime'],
    width: 200,
  },
  {
    title: '开标时间',
    dataIndex: ['bid', 'bidOpenTime'],
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
    width: 120,
  },
];

const statusConfig = computed(() => {
  return (value) => {
    return (
      [
        { value: '未评标', color: 'approval3' },
        { value: '已评标', color: 'approval0' },
      ][value] || { value: '-' }
    );
  };
});

const showDetail = (record, type) => {
  router.push({ path: `/expert/bidding-list/${type}/${record.bidId}` });
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
