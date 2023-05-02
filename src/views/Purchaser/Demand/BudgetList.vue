<template>
  <PageContainer>
    <div>
      <TableSearch
        ref="tableRef"
        :formItems="formItems"
        :formData="formData"
        :columns="columns"
        :api="budgetPage"
      >
        <template #cell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="showDetail(record)">查看</a>
            </a-space>
          </template>
        </template>
      </TableSearch>
      <BudgetModal ref="budgetModal" />
    </div>
  </PageContainer>
</template>

<script setup>
import { getCurrentInstance, ref } from 'vue';
import TableSearch from '@/components/TableSearch/index.vue';
import { budgetPage } from '@/api/operator/demand.js';
import BudgetModal from './components/BudgetModal.vue';

const { proxy } = getCurrentInstance();

const formItems = ref([
  {
    type: 'text',
    label: '品类名称',
    value: 'name',
  },
  {
    type: 'datepicker',
    label: '创建时间',
    value: 'createTime',
  },
]);

const formData = {
  name: undefined,
  createTime: undefined,
};

const columns = [
  {
    title: '序号',
    customRender: ({ index }) => `${index + 1}`,
    width: 80,
  },
  {
    title: '品类名称',
    dataIndex: 'name',
    ellipsis: true,
  },
  {
    title: '预算总金额(含税)',
    dataIndex: 'totalBudget',
    ellipsis: true,
  },
  {
    title: '剩余预算金额(含税)',
    dataIndex: 'residualBudget',
    ellipsis: true,
  },
  {
    title: '创建日期',
    dataIndex: 'createTime',
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    width: 80,
  },
];

const showDetail = (record) => {
  proxy.$refs.budgetModal.show(record);
};
</script>

<style lang="less" scoped></style>
