<template>
  <PageContainer>
    <div>
      <CommonTitleAction title="采购订单收货管理" />
      <TableSearch
        ref="tableRef"
        :formItems="formItems"
        :formData="formData"
        :columns="columns"
        :scroll="{ x: 1240 }"
        :api="orderReceivePage"
      >
        <template #cell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="showDetail(record, 1)">查看</a>
              <a v-if="record.deliveryStatus === 0" @click="showDetail(record, 2)">收货</a>
              <a @click="showApproval(record)">申请售后</a>
            </a-space>
          </template>
          <template v-else-if="column.key === 'deliveryStatus'">
            <div class="align-center">
              <div :class="['approval', deliveryStatusConfig(text).color]"></div>
              <span>{{ deliveryStatusConfig(text).value }}</span>
            </div>
          </template>
        </template>
      </TableSearch>
      <AfterSalesModal ref="afterSalesModal" />
    </div>
  </PageContainer>
</template>

<script setup>
import { getCurrentInstance, computed, ref } from 'vue';
import CommonTitleAction from '@/components/CommonTitleAction/index.vue';
import TableSearch from '@/components/TableSearch/index.vue';
import { orderReceivePage } from '@/api/operator/order';
import { useRouter } from 'vue-router';
import AfterSalesModal from './components/AfterSalesModal.vue';

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
    label: '状态',
    value: 'deliveryStatus',
    options: [
      { label: '未完成', value: 0 },
      { label: '已完成', value: 1 },
    ],
  },
]);

const formData = {
  orderId: undefined,
  companyName: undefined,
  deliveryStatus: undefined,
};

const columns = [
  {
    title: '订单编号',
    dataIndex: 'orderId',
    width: 200,
  },
  {
    title: '企业名称',
    dataIndex: 'companyName',
    ellipsis: true,
    width: 180,
  },
  {
    title: '含税总价',
    dataIndex: 'taxTotalAmount',
    width: 200,
    ellipsis: true,
  },
  {
    title: '供应商名称',
    dataIndex: 'supplierName',
    width: 180,
    ellipsis: true,
  },
  {
    title: '创建日期',
    dataIndex: 'createTime',
    width: 180,
  },
  {
    title: '状态',
    dataIndex: 'deliveryStatus',
    key: 'deliveryStatus',
    width: 120,
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    width: 180,
  },
];

const deliveryStatusConfig = computed(() => {
  return (value) => {
    return (
      [
        { value: '未完成', color: 'approval0' },
        { value: '已完成', color: 'approval1' },
      ][value] || { value: '-' }
    );
  };
});

const showDetail = (record, type) => {
  router.push({ path: `/purchasingManagement/order-list/receive/${type}/${record.id}` });
};
const showApproval = (record) => {
  proxy.$refs.afterSalesModal.show({ orderBiddingId: record.id });
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
