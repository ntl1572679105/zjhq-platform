<template>
  <PageContainer>
    <div>
      <TableSearch
        ref="tableRef"
        :formItems="formItems"
        :formData="formData"
        :columns="columns"
        :scroll="{ x: 2000 }"
        :api="operationList"
        :setupParams="setupParams"
      >
        <template #cell="{ column, record, index, text }">
          <template v-if="column.key === 'status'">
            <span :class="['approval', statusConfig(text).color]">{{
              statusConfig(text).value
            }}</span>
          </template>
        </template>
      </TableSearch>
    </div>
  </PageContainer>
</template>

<script setup>
import { computed } from 'vue';
import TableSearch from '@/components/TableSearch/index.vue';
import { operationList } from '@/api/erp/log.js';
import dayjs from 'dayjs';

const formItems = [
  {
    type: 'select',
    label: '业务类型',
    value: 'bizType',
    options: [
      { label: '列表', value: 'LIST' },
      { label: '详情', value: 'DETAIL' },
      { label: '删除', value: 'DELETE' },
      { label: '更新', value: 'UPDATE' },
      { label: '新增', value: 'INSERT' },
    ],
  },
  {
    type: 'text',
    label: '操作模块',
    value: 'module',
  },
  {
    type: 'text',
    label: '操作人名称',
    value: 'operatorName',
  },
  {
    type: 'rangedatepicker',
    label: '时间',
    value: 'time',
    format: 'YYYY-MM-DD HH:mm:ss',
    showTime: true,
  },
  {
    type: 'select',
    label: '响应状态',
    value: 'status',
    options: [
      { label: '正常', value: 0 },
      { label: '异常', value: 1 },
    ],
  },
];

const formData = {
  bizType: undefined,
  module: undefined,
  operatorName: undefined,
  time: undefined,
  status: undefined,
};

const setupParams = (data) => {
  console.log(data);
  const requestParameters = {};
  if (data && data.time) {
    requestParameters.queryBeginTime = dayjs(data.time[0]).format('YYYY-MM-DD HH:mm:ss');
    requestParameters.queryEndTime = dayjs(data.time[1]).format('YYYY-MM-DD HH:mm:ss');
    requestParameters.time = null;
  }
  return requestParameters;
};

const columns = [
  {
    title: '编号',
    dataIndex: 'id',
    width: 200,
  },
  {
    title: '业务类型',
    dataIndex: 'bizType',
    width: 120,
  },
  {
    title: '模块',
    dataIndex: 'module',
    width: 150,
    ellipsis: true,
  },
  {
    title: '操作人名称',
    dataIndex: 'operatorName',
    width: 180,
    ellipsis: true,
  },
  {
    title: '操作时间',
    dataIndex: 'logTime',
    width: 180,
  },
  {
    title: '请求ip',
    dataIndex: 'requestIp',
    width: 180,
  },
  {
    title: '请求地点',
    dataIndex: 'requestLocation',
    width: 180,
    ellipsis: true,
  },
  {
    title: '请求url',
    dataIndex: 'requestUrl',
    width: 180,
    ellipsis: true,
  },
  {
    title: '请求方式',
    dataIndex: 'requestMethod',
    width: 120,
  },
  {
    title: '请求参数',
    dataIndex: 'requestParam',
    width: 180,
    ellipsis: true,
  },
  {
    title: '响应状态',
    dataIndex: 'status',
    key: 'status',
    width: 120,
  },
  {
    title: '响应结果',
    dataIndex: 'response',
    width: 180,
    ellipsis: true,
  },
];

const statusConfig = computed(() => {
  return (value) => {
    return (
      [
        { value: '正常', color: 'approval1' },
        { value: '异常', color: 'approval2' },
      ][value] || { value: '-' }
    );
  };
});
</script>

<style lang="less" scoped>
.approval {
  position: relative;
  padding-left: 16px;
  &::before {
    content: ' ';
    position: absolute;
    width: 6px;
    height: 6px;
    left: 0;
    border-radius: 50%;
    top: 0;
    bottom: 0;
    margin: auto;
  }
}

.approval0 {
  &:before {
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
    background: #f6434c;
  }
}
</style>
