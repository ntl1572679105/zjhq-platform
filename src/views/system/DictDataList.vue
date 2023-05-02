<template>
  <PageContainer>
    <a-card :bordered="false">
      <CommonTable
        ref="tableRef"
        :columns="columns"
        :api="dictDataList"
        :showPagination="false"
        :params="{ dictTypeId: id }"
      >
        <template #action>
          <a-space class="mb-20">
            <a-button type="primary" @click="handleAdd" v-permission="['sys:dictData:add']"
              >新增</a-button
            >
          </a-space>
        </template>
        <template #cell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="handleEdit(record)" v-permission="['sys:dictData:edit']">编辑</a>
              <a
                @click="deleteSub(record)"
                style="color: #ff4d4f"
                v-permission="['sys:dictData:remove']"
                >删除</a
              >
            </a-space>
          </template>
        </template>
      </CommonTable>
      <DictDataModal ref="dictDataModal" @finish="modalOk" />
    </a-card>
  </PageContainer>
</template>

<script setup>
import { getCurrentInstance } from 'vue';
import CommonTable from '@/components/CommonTable/index.vue';
import { dictDataList, dictDataDelete } from '@/api/erp/dict.js';
import DictDataModal from './components/DictDataModal.vue';

const { proxy } = getCurrentInstance();

const props = defineProps({
  id: String,
});

const columns = [
  {
    title: '序号',
    customRender: ({ index }) => `${index + 1}`,
    width: 80,
  },
  {
    title: '字典键名',
    dataIndex: 'dictKey',
  },
  {
    title: '字典键值',
    dataIndex: 'dictValue',
  },
  {
    title: '排序',
    dataIndex: 'sort',
    width: 100,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    ellipsis: true,
  },
  {
    title: '操作',
    key: 'action',
    width: 120,
  },
];

const handleAdd = () => {
  proxy.$refs.dictDataModal.show({ title: '新增', dictTypeId: props.id });
};
const handleEdit = (record) => {
  proxy.$refs.dictDataModal.show({ title: '编辑', ...record });
};
const deleteSub = (record) => {
  proxy.$confirm({
    title: `确定删除?`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      dictDataDelete(record.id).then(() => {
        proxy.$message.success('删除成功');
        proxy.$refs.tableRef.tableSearch();
      });
    },
  });
};
const modalOk = () => {
  proxy.$refs.tableRef.tableSearch();
};
</script>

<style lang="less" scoped></style>
