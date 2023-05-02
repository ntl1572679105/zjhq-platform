<template>
  <PageContainer>
    <div>
      <CommonTitleAction title="资讯管理">
        <template #right>
          <a-button type="primary" @click="showDetail({ status: 0 }, 0)">新建</a-button>
        </template>
      </CommonTitleAction>
      <TableSearch
        ref="tableRef"
        :formItems="formItems"
        :formData="formData"
        :columns="columns"
        :api="informationPage"
      >
        <template #cell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="showDetail(record, 1)">查看</a>
              <a @click="showDetail(record, 2)">编辑</a>
              <a @click="deleteSub(record)" style="color: #ff4d4f">删除</a>
            </a-space>
          </template>
          <template v-else-if="column.key === 'status'">
            <a-switch
              v-model:checked="record.status"
              :checkedValue="0"
              :unCheckedValue="1"
              @change="(checked) => changeStatus(record, checked)"
              :loading="record.loading"
            />
          </template>
        </template>
      </TableSearch>

      <InfomationModal ref="infomationModal" @finish="refresh" />
    </div>
  </PageContainer>
</template>

<script setup>
import { getCurrentInstance, ref } from 'vue';
import CommonTitleAction from '@/components/CommonTitleAction/index.vue';
import TableSearch from '@/components/TableSearch/index.vue';
import { informationPage, informationDelete, informationEdit } from '@/api/operator/home.js';
import InfomationModal from './components/InfomationModal.vue';

const { proxy } = getCurrentInstance();

const formItems = ref([
  {
    type: 'text',
    label: '资讯标题',
    value: 'title',
  },
  {
    type: 'datepicker',
    label: '创建日期',
    value: 'createTime',
  },
  {
    type: 'select',
    label: '状态',
    value: 'status',
    options: [
      { label: '启用', value: 0 },
      { label: '停用', value: 1 },
    ],
  },
]);

const formData = {
  title: undefined,
  createTime: undefined,
  status: undefined,
};

const columns = [
  {
    title: '序号',
    customRender: ({ index }) => `${index + 1}`,
    width: 80,
  },
  {
    title: '资讯标题',
    dataIndex: 'title',
    ellipsis: true,
  },
  {
    title: '创建人',
    dataIndex: 'createBy',
    ellipsis: true,
  },
  {
    title: '创建日期',
    dataIndex: 'createTime',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    width: 140,
  },
];

const showDetail = (record, type) => {
  proxy.$refs.infomationModal.show(record, type);
};

const changeStatus = (record, checked) => {
  record.loading = true;
  informationEdit({ ...record, status: checked ? 1 : 0 })
    .then(() => {
      proxy.$message.success('状态修改成功');
      record.status = checked ? 1 : 0;
    })
    .catch(() => {
      proxy.$message.warning('状态修改失败');
      record.status = checked ? 0 : 1;
    })
    .finally(() => {
      record.loading = false;
    });
};

const deleteSub = (record) => {
  proxy.$confirm({
    title: `确定删除-${record.title}?`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      informationDelete(record.id).then(() => {
        proxy.$message.success('删除成功');
        proxy.$refs.tableRef.refresh();
      });
    },
  });
};

const refresh = () => {
  proxy.$refs.tableRef.refresh();
};
</script>

<style lang="less" scoped></style>
