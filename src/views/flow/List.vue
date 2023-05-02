<template>
  <PageContainer>
    <div>
      <TableSearch
        ref="tableRef"
        :formItems="formItems"
        :formData="formData"
        :columns="columns"
        :api="processList"
      >
        <template #action>
          <a-space class="mb-20">
            <a-button type="primary" @click="handleAdd">新增</a-button>
          </a-space>
        </template>
        <template #cell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="handleEdit(record)">编辑</a>
              <a @click="handleFlow(record)">流程设计</a>
              <a @click="deleteSub(record)" style="color: #ff4d4f">删除</a>
            </a-space>
          </template>
          <template v-else-if="column.key === 'status'">
            {{ statusName(text) }}
          </template>
        </template>
      </TableSearch>
      <FlowModal ref="flowModal" @finish="modalOk" />
    </div>
  </PageContainer>
</template>

<script setup>
import { getCurrentInstance, computed } from 'vue';
import TableSearch from '@/components/TableSearch/index.vue';
import { processList, processDelete } from '@/api/flow';
import FlowModal from './components/FlowModal.vue';

const { proxy } = getCurrentInstance();

const formItems = [
  {
    type: 'text',
    label: '流程名称',
    value: 'name',
  },
  {
    type: 'text',
    label: '流程key',
    value: 'definitionKey',
  },
];

const formData = {
  name: undefined,
  definitionKey: undefined,
};

const columns = [
  {
    title: '序号',
    customRender: ({ index }) => `${index + 1}`,
    width: 80,
  },
  {
    title: '流程名称',
    dataIndex: 'name',
    ellipsis: true,
  },
  {
    title: '流程key',
    dataIndex: 'definitionKey',
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
    width: 200,
  },
];

const statusName = computed(() => {
  return (value) => {
    return ['挂起', '激活'][value] || '-';
  };
});

const handleAdd = () => {
  proxy.$refs.flowModal.show({ title: '新增' });
};
const handleEdit = (record) => {
  proxy.$refs.flowModal.show({ title: '编辑', ...record });
};
const handleFlow = (record) => {
  proxy.$router.push({ path: `/system/flow-list/${record.id}` });
};
const deleteSub = (record) => {
  proxy.$confirm({
    title: `确定删除-${record.name}?`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      processDelete(record.id).then(() => {
        proxy.$message.success('删除成功');
        proxy.$refs.tableRef.refresh();
      });
    },
  });
};
const modalOk = () => {
  proxy.$refs.tableRef.refresh();
};
</script>

<style lang="less" scoped></style>
