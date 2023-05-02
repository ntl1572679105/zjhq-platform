<template>
  <PageContainer>
    <a-card :bordered="false">
      <TableSearch
        ref="tableRef"
        :formItems="formItems"
        :formData="formData"
        :columns="columns"
        :api="userList"
        :setupParams="setupParams"
      >
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
      </TableSearch>
    </a-card>
  </PageContainer>
</template>

<script setup>
import { getCurrentInstance } from 'vue';
import TableSearch from '@/components/TableSearch/index.vue';
import { userList, userDelete } from '@/api/user.js';
import dayjs from 'dayjs';

const { proxy } = getCurrentInstance();

const formItems = [
  {
    type: 'text',
    label: '姓名',
    value: 'userName',
  },
  {
    type: 'text',
    label: '手机号',
    value: 'phone',
  },
  {
    type: 'select',
    label: '状态',
    value: 'status',
    options: [
      { label: '正常', value: 0 },
      { label: '禁用', value: 1 },
    ],
  },
  {
    type: 'rangedatepicker',
    label: '时间',
    value: 'time',
  },
];

const formData = {
  userName: undefined,
  phone: undefined,
  status: undefined,
  beginTime: undefined,
  endTime: undefined,
};

const setupParams = (data) => {
  console.log(data);
  const requestParameters = {};
  if (data && data.time) {
    requestParameters.beginTime = dayjs(data.time[0]).format('YYYY-MM-DD');
    requestParameters.endTime = dayjs(data.time[1]).format('YYYY-MM-DD');
  }
  return requestParameters;
};

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
