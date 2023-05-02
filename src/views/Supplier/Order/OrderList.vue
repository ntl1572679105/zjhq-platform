<template>
  <PageContainer>
    <div>
      <CommonTitleAction title="竞价台" />
      <TableSearch
        ref="tableRef"
        :formItems="formItems"
        :formData="formData"
        :columns="columns"
        :scroll="{ x: 1040 }"
        :api="orderList"
      >
        <template #cell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" @click="showDetail(record, 1)">查看</a-button>
              <a-button
                type="link"
                v-if="record.supplierBidStatus === 3"
                @click="showDetail(record, 2)"
                >发起竞价</a-button
              >
            </a-space>
          </template>
          <template v-else-if="column.key === 'biddingStatus'">
            <div class="align-center">
              <div :class="['approval', biddingStatusConfig(text).color]"></div>
              <span>{{ biddingStatusConfig(text).value }}</span>
            </div>
          </template>
        </template>
      </TableSearch>
    </div>
  </PageContainer>
</template>

<script setup>
import { getCurrentInstance, computed, ref } from 'vue';
import CommonTitleAction from '@/components/CommonTitleAction/index.vue';
import TableSearch from '@/components/TableSearch/index.vue';
import { orderList } from '@/api/supplier/order';
import { useRouter } from 'vue-router';

const { proxy } = getCurrentInstance();
const router = useRouter();

const formItems = ref([
  {
    type: 'text',
    label: '订单编号',
    value: 'id',
  },
  {
    type: 'text',
    label: '企业名称',
    value: 'companyName',
  },
  {
    type: 'select',
    label: '状态',
    value: 'supplierBidStatus',
    options: [
      { label: '竞价中', value: 0 },
      { label: '已通过', value: 1 },
      { label: '未通过', value: 2 },
      { label: '未发起竞价', value: 3 },
    ],
  },
]);

const formData = {
  id: undefined,
  companyName: undefined,
  supplierBidStatus: undefined,
};

const columns = [
  {
    title: '订单编号',
    dataIndex: 'id',
    width: 200,
  },
  {
    title: '企业名称',
    dataIndex: 'companyName',
    ellipsis: true,
    width: 180,
  },
  {
    title: '竞价开始时间',
    dataIndex: 'biddingBeginTime',
    width: 180,
  },
  {
    title: '竞价截止时间',
    dataIndex: 'biddingEndTime',
    width: 180,
  },
  {
    title: '状态',
    dataIndex: 'supplierBidStatus',
    key: 'biddingStatus',
    width: 120,
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    width: 180,
  },
];

const biddingStatusConfig = computed(() => {
  return (value) => {
    return (
      [
        { value: '竞价中', color: 'approval0' },
        { value: '已通过', color: 'approval1' },
        { value: '未通过', color: 'approval2' },
        { value: '未发起竞价', color: 'approval-1' },
      ][value] || { value: '-' }
    );
  };
});

const showDetail = (record, type) => {
  if (type === 1 && record.supplierBidStatus !== 3) {
    // 如果是查看已发起竞价，则type为3
    router.push({ path: `/supplier/order-list/3/${record.bidId}` });
  } else {
    router.push({ path: `/supplier/order-list/${type}/${record.id}` });
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
