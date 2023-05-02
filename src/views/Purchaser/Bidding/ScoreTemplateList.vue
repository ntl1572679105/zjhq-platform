<template>
  <PageContainer>
    <div>
      <CommonTitleAction title="模板列表">
        <template #right>
          <a-button type="primary" @click="showDetail()">新建</a-button>
        </template>
      </CommonTitleAction>
      <TableSearch
        ref="tableRef"
        :formItems="formItems"
        :formData="formData"
        :columns="columns"
        :scroll="{ x: 1000 }"
        :api="scoreTemplatePage"
      >
        <template #cell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="showDetail(record, 1)">详情</a>
              <a @click="showDetail(record, 2)">编辑</a>
              <a @click="deleteSub(record)" style="color: #ff4d4f">删除</a>
            </a-space>
          </template>
          <template v-else-if="column.key === 'status'">
            <a-switch
              v-model:checked="record.status"
              :checkedValue="1"
              :unCheckedValue="0"
              @change="(checked) => changeStatus(record, checked)"
              :loading="record.loading"
            />
          </template>
        </template>
      </TableSearch>
    </div>
  </PageContainer>
</template>

<script setup>
import { getCurrentInstance, ref } from 'vue';
import CommonTitleAction from '@/components/CommonTitleAction/index.vue';
import TableSearch from '@/components/TableSearch/index.vue';
import { scoreTemplatePage, scoreTemplateDelete, scoreTemplateEdit } from '@/api/operator/bid';
import { useRouter } from 'vue-router';

const { proxy } = getCurrentInstance();
const router = useRouter();

const formItems = ref([
  {
    type: 'text',
    label: '模版编号',
    value: 'id',
  },
  {
    type: 'text',
    label: '模版名称',
    value: 'name',
  },
  {
    type: 'select',
    label: '模版状态',
    value: 'status',
    options: [
      { label: '未启用', value: 0 },
      { label: '启用', value: 1 },
    ],
  },
]);

const formData = {
  name: undefined,
  id: undefined,
  status: undefined,
};

const columns = [
  {
    title: '模版编号',
    dataIndex: 'id',
    width: 200,
  },
  {
    title: '模版名称',
    dataIndex: 'name',
    ellipsis: true,
    width: 180,
  },
  {
    title: '创建人',
    dataIndex: 'createBy',
    width: 180,
    ellipsis: true,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 200,
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
    width: 120,
  },
];

const showDetail = (record, type) => {
  if (record) {
    router.push({ path: `/purchasingBidding/template-list/${type}/${record.id}` });
  } else {
    router.push({ path: '/purchasingBidding/template-list/add' });
  }
};

const changeStatus = (record, checked) => {
  record.loading = true;
  scoreTemplateEdit({ ...record, status: checked ? 1 : 0 })
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
    title: `确定删除-${record.name}?`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      scoreTemplateDelete(record.id).then(() => {
        proxy.$message.success('删除成功');
        proxy.$refs.tableRef.refresh();
      });
    },
  });
};
</script>

<style lang="less" scoped></style>
