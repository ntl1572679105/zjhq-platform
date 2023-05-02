<template>
  <PageContainer>
    <div>
      <CommonTitleAction title="品牌促销">
        <template #right>
          <a-button type="primary" @click="showAdd">新建</a-button>
        </template>
      </CommonTitleAction>
      <TableSearch
        ref="tableRef"
        :formItems="formItems"
        :formData="formData"
        :columns="columns"
        :api="recommenderPage"
        :setupParams="setupParams"
      >
        <template #cell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="showEdit(record)">编辑</a>
              <a @click="deleteSub(record)" style="color: #ff4d4f">删除</a>
            </a-space>
          </template>
          <template v-else-if="column.key === 'image'">
            <a-image :width="40" :src="text" v-if="text" />
          </template>
          <template v-else-if="column.key === 'sku'">
            {{ text ? `${text.key}：${text.value}` : '-' }}
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

      <GoodModal ref="goodModal" @finish="refresh" />
    </div>
  </PageContainer>
</template>

<script setup>
import { getCurrentInstance, ref } from 'vue';
import CommonTitleAction from '@/components/CommonTitleAction/index.vue';
import TableSearch from '@/components/TableSearch/index.vue';
import { recommenderPage, recommenderDelete, recommenderEdit } from '@/api/operator/home.js';
import GoodModal from './components/GoodModal.vue';

const { proxy } = getCurrentInstance();

const formItems = ref([
  {
    type: 'text',
    label: '商品编号',
    value: 'productId',
  },
  {
    type: 'text',
    label: '商品名称',
    value: 'productName',
  },
  {
    type: 'text',
    label: '规格编号',
    value: 'skuId',
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
  productId: undefined,
  productName: undefined,
  skuId: undefined,
  status: undefined,
  type: 1,
};

const setupParams = (params) => {
  params.type = 1;
  return params;
};

const columns = [
  {
    title: '商品编号',
    dataIndex: 'productId',
    ellipsis: true,
  },
  {
    title: '商品名称',
    dataIndex: 'productName',
    ellipsis: true,
  },
  //   {
  //     title: '主图',
  //     dataIndex: 'mainUrl',
  //     key: 'image',
  //     width: 80,
  //   },
  {
    title: '规格编号',
    dataIndex: 'skuId',
    ellipsis: true,
  },
  {
    title: '规格',
    dataIndex: 'attributeDTO',
    key: 'sku',
    ellipsis: true,
  },
  {
    title: '价格',
    dataIndex: 'taxPrice',
  },
  {
    title: '排序',
    dataIndex: 'sort',
    width: 80,
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
    width: 140,
  },
];

const showAdd = () => {
  proxy.$refs.goodModal.show({ title: '新增', type: 1 });
};

const showEdit = (record) => {
  proxy.$refs.goodModal.show({ title: '编辑', ...record, type: 1 });
};

const changeStatus = (record, checked) => {
  record.loading = true;
  recommenderEdit({ ...record, status: checked ? 1 : 0 })
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
    title: `确定删除-${record.productName}，规格：${
      record.attributeDTO ? `${record.attributeDTO.key}：${record.attributeDTO.value}` : '-'
    }?`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      recommenderDelete(record.id).then(() => {
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
