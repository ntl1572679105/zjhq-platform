<template>
  <PageContainer>
    <div>
      <CommonTitleAction title="采购订单管理">
        <template #right>
          <a-button type="primary" @click="showDetail()">新建订单</a-button>
        </template>
      </CommonTitleAction>
      <TableSearch
        ref="tableRef"
        :formItems="formItems"
        :formData="formData"
        :columns="columns"
        :scroll="{ x: 1360 }"
        :api="orderPage"
      >
        <template #cell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" @click="showDetail(record, 1)">查看</a-button>
              <a-button
                type="link"
                v-if="record.approvalStatus === -1 || record.approvalStatus === 2"
                @click="showDetail(record, 2)"
                >编辑</a-button
              >

              <a-button
                type="link"
                v-if="record.approvalStatus === 0 && record.type === 0"
                @click="showApproval(record)"
                >审批</a-button
              >
              <a-button
                type="link"
                v-else-if="record.approvalStatus === 2"
                @click="showApproval(record)"
                :loading="record.loading"
                >重新提交</a-button
              >
              <a-button
                type="link"
                v-else-if="record.approvalStatus === 1 && record.biddingStatus === 0"
                @click="showApproval(record)"
                :loading="record.loading"
                >竞价</a-button
              >
            </a-space>
          </template>
          <template v-else-if="column.key === 'approvalStatus'">
            <span v-if="record.type === 1">-</span>
            <div v-else class="align-center">
              <div :class="['approval', approvalStatusConfig(text).color]"></div>
              <span>{{ approvalStatusConfig(text).value }}</span>
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
import { orderPage, orderRepeat } from '@/api/operator/order';
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
    label: '订单类型',
    value: 'type',
    options: [
      { label: '竞价', value: 0 },
      { label: '录入', value: 1 },
      { label: '直采', value: 2 },
    ],
  },
  {
    type: 'text',
    label: '创建人',
    value: 'createBy',
  },
  {
    type: 'select',
    label: '审批状态',
    value: 'approvalStatus',
    options: [
      { label: '待提交', value: -1 },
      { label: '待审批', value: 0 },
      { label: '已通过', value: 1 },
      { label: '已拒绝', value: 2 },
    ],
  },
  {
    type: 'datepicker',
    label: '创建日期',
    value: 'createTime',
  },
]);

const formData = {
  id: undefined,
  companyName: undefined,
  createBy: undefined,
  type: undefined,
  approvalStatus: undefined,
  createTime: undefined,
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
    title: '订单总金额(含税)',
    dataIndex: 'taxPrice',
    width: 200,
    ellipsis: true,
  },
  {
    title: '创建人',
    dataIndex: 'createBy',
    width: 180,
    ellipsis: true,
  },
  {
    title: '订单类型',
    dataIndex: 'type',
    key: 'type',
    width: 120,
  },
  {
    title: '创建日期',
    dataIndex: 'createTime',
    width: 180,
  },
  {
    title: '审批状态',
    dataIndex: 'approvalStatus',
    key: 'approvalStatus',
    width: 120,
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    width: 180,
  },
];

const approvalStatusConfig = computed(() => {
  return (value) => {
    if (value === -1) {
      return { value: '待提交', color: 'approval-1' };
    }
    return (
      [
        { value: '待审批', color: 'approval0' },
        { value: '已通过', color: 'approval1' },
        { value: '已拒绝', color: 'approval2' },
      ][value] || { value: '-' }
    );
  };
});

const typeName = computed(() => {
  return (value) => {
    return ['竞价', '录入', '直采'][value];
  };
});

const showDetail = (record, type) => {
  if (record) {
    if (record.biddingStatus === 0 || record.type === 2) {
      router.push({ path: `/purchasingManagement/order-list/${type}/${record.id}` });
    } else {
      router.push({ path: `/purchasingManagement/order-list/bid/1/${record.id}` });
    }
  } else {
    router.push({ path: `/purchasingManagement/order-list/add` });
  }
};
const showApproval = (record) => {
  if (record.approvalStatus === 0) {
    router.push({ path: `/purchasingManagement/order-list/3/${record.id}` });
  } else if (record.approvalStatus === 1) {
    proxy.$confirm({
      content: '请确认是否发起竞价',
      onOk() {
        router.push({ path: `/purchasingManagement/order-list/bid/0/${record.id}` });
      },
    });
  } else {
    record.loading = true;
    orderRepeat(record.id)
      .then(() => {
        proxy.$message.success('提交审核成功');
        proxy.$refs.tableRef.refresh();
      })
      .finally(() => {
        record.loading = false;
      });
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
