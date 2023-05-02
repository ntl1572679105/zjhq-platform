<template>
  <PageContainer>
    <a-card :bordered="false">
      <CommonTable ref="tableRef" :columns="columns" :api="userList">
        <template #cell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="deleteSub(record)" style="color: #ff4d4f">删除</a>
            </a-space>
          </template>
          <template v-else-if="column.key === 'status'">
            <span>{{ text === 0 ? '正常' : '关闭' }}</span>
          </template>
        </template>
      </CommonTable>
    </a-card>
  </PageContainer>
</template>

<script setup>
import { getCurrentInstance } from 'vue';
import CommonTable from '@/components/CommonTable/index.vue';
import { userList, userDelete } from '@/api/user.js';

const { proxy } = getCurrentInstance();

const columns = [
  {
    title: '序号',
    customRender: ({ index }) => `${index + 1}`,
  },
  {
    title: '姓名',
    dataIndex: 'userName',
  },
  {
    title: '手机号',
    dataIndex: 'phone',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    align: 'center',
  },
];

// 删除
const deleteSub = (record) => {
  proxy.$confirm({
    title: `确定删除?`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      userDelete(record.id).then(() => {
        proxy.$message.success('删除成功');
        proxy.$refs.tableRef.tableSearch();
      });
    },
  });
};
</script>

<style lang="less" scoped></style>
