<template>
  <PageContainer>
    <div>
      <CommonTitleAction title="采购订单售后" />
      <TableSearch
        ref="tableRef"
        :formItems="formItems"
        :formData="formData"
        :columns="columns"
        :scroll="{ x: 1200 }"
        :api="orderAfterSalesPage"
      >
        <template #cell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" @click="showDetail(record)">查看</a-button>
              <a-button
                v-permission="['operator:orderBiddingAfterSales:edit']"
                type="link"
                v-if="record.status === 0"
                @click="showApproval(record)"
                >处理</a-button
              >
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

      <AfterSalesDetailModal ref="afterSalesDetailModal" />
      <AfterSalesDealModal ref="afterSalesDealModal" @finish="refresh" />
    </div>
  </PageContainer>
</template>

<script setup>
import { getCurrentInstance, computed, ref } from 'vue';
import CommonTitleAction from '@/components/CommonTitleAction/index.vue';
import TableSearch from '@/components/TableSearch/index.vue';
import { orderAfterSalesPage } from '@/api/operator/order';
import AfterSalesDetailModal from './components/AfterSalesDetailModal.vue';
import AfterSalesDealModal from './components/AfterSalesDealModal.vue';

const { proxy } = getCurrentInstance();

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
    label: '售后类型',
    value: 'type',
    options: [
      { label: '仅退款', value: 0 },
      { label: '退换货', value: 1 },
      { label: '退货退款', value: 2 },
    ],
  },
  {
    type: 'select',
    label: '状态',
    value: 'status',
    options: [
      { label: '未处理', value: 0 },
      { label: '已通过', value: 1 },
      { label: '未通过', value: 2 },
    ],
  },
]);

const formData = {
  orderId: undefined,
  companyName: undefined,
  type: undefined,
  status: undefined,
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
    title: '发起人',
    dataIndex: 'createBy',
    width: 180,
    ellipsis: true,
  },
  {
    title: '售后类型',
    dataIndex: 'type',
    key: 'type',
    width: 180,
  },
  {
    title: '售后原因',
    dataIndex: 'reason',
    ellipsis: true,
    width: 180,
  },
  {
    title: '处理人',
    dataIndex: 'handler',
    width: 180,
    ellipsis: true,
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
        { value: '未处理', color: 'approval0' },
        { value: '已通过', color: 'approval1' },
        { value: '未通过', color: 'approval2' },
      ][value] || { value: '-' }
    );
  };
});

const typeName = computed(() => {
  return (value) => {
    return ['仅退款', '退换货', '退货退款'][value];
  };
});

const showDetail = (record) => {
  proxy.$refs.afterSalesDetailModal.show(record);
};
const showApproval = (record) => {
  proxy.$refs.afterSalesDealModal.show(record);
};
const refresh = () => {
  proxy.$refs.tableRef.refresh();
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
