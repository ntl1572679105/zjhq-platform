<template>
  <PageContainer>
    <div>
      <CommonTitleAction title="采购订单竞价" />
      <TableSearch
        ref="tableRef"
        :formItems="formItems"
        :formData="formData"
        :columns="columns"
        :scroll="{ x: 1160 }"
        :api="orderBidPage"
      >
        <template #cell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" @click="showDetail(record)">查看</a-button>
              <a-button v-if="record.biddingStatus === 0" type="link" @click="showApproval(record)"
                >发起竞价</a-button
              >
              <a-button
                type="link"
                v-else-if="record.biddingStatus === 1"
                @click="showApproval(record)"
                >竞价审核</a-button
              >
              <a-button
                type="link"
                v-else-if="record.biddingStatus === 2"
                @click="showContract(record)"
                :loading="record.loading"
                >发起合同</a-button
              >
            </a-space>
          </template>
          <template v-else-if="column.key === 'biddingStatus'">
            <div class="align-center">
              <div :class="['approval', biddingStatusConfig(text).color]"></div>
              <span>{{ biddingStatusConfig(text).value }}</span>
            </div>
          </template>
          <template v-else-if="column.key === 'type'">{{ typeName(text) }}</template>
        </template>
      </TableSearch>
    </div>
  </PageContainer>
</template>

<script setup>
import { getCurrentInstance, computed, ref } from 'vue';
import CommonTitleAction from '@/components/CommonTitleAction/index.vue';
import TableSearch from '@/components/TableSearch/index.vue';
import { orderBidPage } from '@/api/operator/order';
import { useRouter } from 'vue-router';

const { proxy } = getCurrentInstance();
const router = useRouter();

const formItems = ref([
  {
    type: 'text',
    label: '订单编号',
    value: 'orderId',
  },
  {
    type: 'text',
    label: '企业名称',
    value: 'companyName',
  },
  {
    type: 'select',
    label: '竞价方式',
    value: 'biddingType',
    options: [
      { label: '公开', value: 0 },
      { label: '邀请', value: 1 },
    ],
  },
  {
    type: 'select',
    label: '状态',
    value: 'biddingStatus',
    options: [
      { label: '待竞价', value: 0 },
      { label: '竞价中', value: 1 },
      { label: '竞价结束', value: 2 },
    ],
  },
]);

const formData = {
  orderId: undefined,
  companyName: undefined,
  biddingType: undefined,
  biddingStatus: undefined,
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
    title: '竞价方式',
    dataIndex: 'biddingType',
    key: 'type',
    width: 120,
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
    dataIndex: 'biddingStatus',
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
        { value: '待竞价', color: 'approval-1' },
        { value: '竞价中', color: 'approval0' },
        { value: '竞价结束', color: 'approval2' },
      ][value] || { value: '-' }
    );
  };
});

const typeName = computed(() => {
  return (value) => {
    return ['公开', '邀请'][value];
  };
});

const showDetail = (record) => {
  if (record.biddingStatus === 0) {
    router.push({ path: `/purchasingManagement/order-bid-list/2/${record.id}` });
  } else if (record.biddingStatus === 2) {
    router.push({ path: `/purchasingManagement/orderbid-list/${record.id}` });
  } else {
    router.push({ path: `/purchasingManagement/orderbid-list/1/${record.id}` });
  }
};
const showApproval = (record) => {
  if (record.biddingStatus === 0) {
    proxy.$confirm({
      content: '请确认是否发起竞价',
      onOk() {
        router.push({ path: `/purchasingManagement/order-bid-list/0/${record.id}` });
      },
    });
  } else {
    router.push({ path: `/purchasingManagement/orderbid-list/${record.id}` });
  }
};
const showContract = (record) => {};
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
