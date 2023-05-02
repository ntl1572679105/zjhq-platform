<template>
  <PageContainer>
    <div>
      <CommonTitleAction title="廉政合约管理">
        <template #right>
          <a-button type="primary" @click="showDetail()">新增廉政公约</a-button>
        </template>
      </CommonTitleAction>
      <TableSearch
        ref="tableRef"
        :formItems="formItems"
        :formData="formData"
        :columns="columns"
        :scroll="{ x: 1280 }"
        :api="integrityContractPage"
      >
        <template #cell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="showDetail(record, 1)">查看</a>
              <a-button
                v-if="record.approvalStatus === -1"
                type="link"
                @click="showApproval(record)"
                >发起审批</a-button
              >
              <a-button
                v-else-if="record.approvalStatus === 0"
                type="link"
                @click="showApproval(record)"
                >审批</a-button
              >
              <a-button
                type="link"
                v-else-if="record.approvalStatus === 2"
                @click="showApproval(record)"
                :loading="record.loading"
                >重新发起</a-button
              >
            </a-space>
          </template>
          <template v-else-if="column.key === 'status'">
            <div class="align-center">
              <div :class="['approval', statusConfig(text).color]"></div>
              <span>{{ statusConfig(text).value }}</span>
            </div>
          </template>
          <template v-else-if="column.key === 'approvalStatus'">
            <div class="align-center">
              <div :class="['approval', approvalStatusConfig(text).color]"></div>
              <span>{{ approvalStatusConfig(text).value }}</span>
            </div>
          </template>
        </template>
      </TableSearch>
    </div>
  </PageContainer>
</template>

<script setup>
import { computed, ref, getCurrentInstance } from 'vue';
import CommonTitleAction from '@/components/CommonTitleAction/index.vue';
import TableSearch from '@/components/TableSearch/index.vue';
import { integrityContractPage, contractCommit } from '@/api/operator/contract';
import { useRouter } from 'vue-router';

const router = useRouter();
const { proxy } = getCurrentInstance();

const formItems = ref([
  {
    type: 'text',
    label: '合同编号',
    value: 'id',
  },
  {
    type: 'text',
    label: '合同名称',
    value: 'name',
  },
  {
    type: 'text',
    label: '企业名称',
    value: 'enterprise',
  },
  {
    type: 'datepicker',
    label: '签订日期',
    value: 'signTime',
  },
  {
    type: 'select',
    label: '合同状态',
    value: 'status',
    options: [
      { label: '待定', value: 0 },
      { label: '履行中', value: 1 },
      { label: '履行完成', value: 2 },
    ],
  },
]);

const formData = {
  id: undefined,
  name: undefined,
  enterprise: undefined,
  signTime: undefined,
  status: undefined,
};

const columns = [
  {
    title: '合同编号',
    dataIndex: 'id',
    width: 200,
  },
  {
    title: '合同名称',
    dataIndex: 'name',
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
    title: '负责人',
    dataIndex: 'person',
    width: 120,
    ellipsis: true,
  },
  {
    title: '签订日期',
    dataIndex: 'signTime',
    width: 200,
  },
  {
    title: '合同总金额',
    dataIndex: 'totalAmount',
    width: 200,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 120,
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
    width: 160,
  },
];

const statusConfig = computed(() => {
  return (value) => {
    return (
      [
        { value: '待定', color: 'approval-1' },
        { value: '履行中', color: 'approval0' },
        { value: '履行完成', color: 'approval1' },
      ][value] || { value: '-' }
    );
  };
});

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

const showDetail = (record, type) => {
  if (record) {
    router.push({ path: `/purchasing/integrityContract-list/1/${type}/${record.id}` });
  } else {
    router.push({ path: `/purchasing/integrityContract-list/1/add` });
  }
};
const showApproval = (record) => {
  if (record.approvalStatus === 0) {
    router.push({ path: `/purchasing/integrityContract-list/1/3/${record.id}` });
  } else {
    record.loading = true;
    contractCommit(record.id)
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
