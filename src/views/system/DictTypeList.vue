<template>
  <PageContainer>
    <div>
      <TableSearch
        ref="tableRef"
        :formItems="formItems"
        :formData="formData"
        :columns="columns"
        :api="dictTypeList"
      >
        <template #action>
          <a-space class="mb-20">
            <a-button type="primary" @click="handleAdd" v-permission="['sys:dictType:add']"
              >新增</a-button
            >
          </a-space>
        </template>
        <template #cell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="handleEdit(record)" v-permission="['sys:dictType:edit']">编辑</a>
              <a @click="handleDetail(record)" v-permission="['sys:dictType:detail']">详情</a>
              <a
                @click="deleteSub(record)"
                style="color: #ff4d4f"
                v-permission="['sys:dictType:remove']"
                >删除</a
              >
            </a-space>
          </template>
          <template v-else-if="column.key === 'status'">
            {{ statusName(text) }}
          </template>
        </template>
      </TableSearch>
      <DictTypeModal ref="dictTypeModal" @finish="modalOk" />
    </div>
  </PageContainer>
</template>

<script setup>
import { getCurrentInstance, computed } from 'vue';
import TableSearch from '@/components/TableSearch/index.vue';
import { dictTypeList, dictTypeDelete } from '@/api/erp/dict.js';
import DictTypeModal from './components/DictTypeModal.vue';

const { proxy } = getCurrentInstance();

const formItems = [
  {
    type: 'text',
    label: '类型名称',
    value: 'name',
  },
  {
    type: 'select',
    label: '状态',
    value: 'status',
    options: [
      { label: '正常', value: 0 },
      { label: '停用', value: 1 },
    ],
  },
];

const formData = {
  name: undefined,
  status: undefined,
};

const columns = [
  {
    title: '序号',
    customRender: ({ index }) => `${index + 1}`,
    width: 80,
  },
  {
    title: '类型名称',
    dataIndex: 'name',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '备注',
    dataIndex: 'remark',
    ellipsis: true,
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
    return ['正常', '停用'][value] || '-';
  };
});

const handleAdd = () => {
  proxy.$refs.dictTypeModal.show({ title: '新增', status: 0 });
};
const handleEdit = (record) => {
  proxy.$refs.dictTypeModal.show({ title: '编辑', ...record });
};
const handleDetail = (record) => {
  proxy.$router.push({ path: `/system/dict-list/${record.id}` });
};
const deleteSub = (record) => {
  proxy.$confirm({
    title: `确定删除?`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      dictTypeDelete(record.id).then(() => {
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
