<template>
  <PageContainer>
    <div>
      <TableSearch
        ref="tableRef"
        :formItems="formItems"
        :formData="formData"
        :columns="columns"
        :scroll="{ x: 1420 }"
        :api="loginList"
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
import { loginList } from '@/api/erp/log.js';
import dayjs from 'dayjs';

const formItems = [
  {
    type: 'text',
    label: '登录人名称',
    value: 'operatorName',
    width: 6,
  },
  {
    type: 'rangedatepicker',
    label: '登录时间',
    value: 'time',
    format: 'YYYY-MM-DD HH:mm:ss',
    showTime: true,
    width: 12,
  },
  {
    type: 'select',
    label: '登录状态',
    value: 'status',
    options: [
      { label: '正常', value: 0 },
      { label: '异常', value: 1 },
    ],
    width: 6,
  },
];

const formData = {
  operatorName: undefined,
  time: undefined,
  status: undefined,
};

const setupParams = (data) => {
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
    title: '登录人名称',
    dataIndex: 'operatorName',
    width: 180,
    ellipsis: true,
  },
  {
    title: '登录人id',
    dataIndex: 'operatorId',
    width: 200,
  },
  {
    title: '登录时间',
    dataIndex: 'loginTime',
    width: 180,
  },
  {
    title: '登录ip',
    dataIndex: 'loginIp',
    width: 180,
  },
  {
    title: '登录地点',
    dataIndex: 'loginLocation',
    width: 180,
    ellipsis: true,
  },
  {
    title: '登录状态',
    dataIndex: 'status',
    key: 'status',
    width: 120,
  },
  {
    title: '提示消息',
    dataIndex: 'msg',
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
