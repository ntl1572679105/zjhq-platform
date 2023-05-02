<template>
  <PageContainer>
    <div>
      <CommonTitleAction title="商品中心管理">
        <template #right>
          <a-space>
            <a-button type="primary" @click="importGoods">商品导入</a-button>
            <a-button type="primary" @click="showApproval">新建商品</a-button>
          </a-space>
        </template>
      </CommonTitleAction>
      <TableSearch
        ref="tableRef"
        :formItems="formItems"
        :formData="formData"
        :columns="columns"
        :scroll="{ x: 1600 }"
        :api="GoodsList"
        :setupParams="setupParams"
      >
        <template #cell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="showApproval(record, 1)">查看</a>
              <a @click="showApproval(record, 2)">修改</a>
              <!-- <a @click="priceCompare(record)">比价</a> -->
            </a-space>
          </template>
          <template v-else-if="column.key === 'categoryVos'">
            {{ record.categoryVos.map((item) => item.name).join('/') }}
          </template>
          <template v-else-if="column.key === 'status'">
            <a-switch
              v-model:checked="record.status"
              :checkedValue="0"
              :unCheckedValue="1"
              @change="(checked) => changeStatus(record, checked)"
              :loading="record.loading"
            ></a-switch>
          </template>
        </template>
      </TableSearch>
      <ImportFileModal ref="importFileModal" @finished="refresh" />
    </div>
  </PageContainer>
</template>

<script setup>
import { getCurrentInstance, ref, onMounted } from 'vue';
import CommonTitleAction from '@/components/CommonTitleAction/index.vue';
import TableSearch from '@/components/TableSearch/index.vue';
import { GoodsList, UpdateGoods } from '@/api/goods.js';
import { useRouter } from 'vue-router';
import { categoryAll } from '@/api/common';
import ImportFileModal from '@/components/ImportModal/ImportFileModal.vue';

const { proxy } = getCurrentInstance();
const router = useRouter();

const productCategoryList = ref([]);

const formItems = ref([
  {
    type: 'text',
    label: '商品编号',
    value: 'id',
  },
  {
    type: 'text',
    label: '商品名称',
    value: 'name',
  },
  {
    type: 'text',
    label: '商品别名',
    value: 'aliasName',
  },
  {
    type: 'cascaderSelect',
    label: '商品类型',
    value: 'categoryIds',
    options: productCategoryList,
  },
  {
    type: 'select',
    label: '商品状态',
    value: 'status',
    options: [
      { label: '启用', value: 0 },
      { label: '停用', value: 1 },
    ],
  },
]);

const formData = {
  id: undefined,
  name: undefined,
  aliasName: undefined,
  status: undefined,
  categoryIds: undefined,
};

const setupParams = (data) => {
  console.log(data);
  const requestParameters = {};
  if (data && data.categoryIds) {
    requestParameters.categoryId = data.categoryIds[data.categoryIds.length - 1];
    requestParameters.categoryIds = undefined;
  }
  return requestParameters;
};

const columns = [
  {
    title: '商品编号',
    dataIndex: 'id',
    width: 200,
  },
  {
    title: '商品名称',
    dataIndex: 'name',
    ellipsis: true,
    width: 180,
  },
  {
    title: '商品别名',
    dataIndex: 'aliasName',
    ellipsis: true,
    width: 180,
  },
  {
    title: '商品类型',
    key: 'categoryVos',
    width: 250,
    ellipsis: true,
  },
  {
    title: '单位',
    dataIndex: 'unit',
    width: 100,
    ellipsis: true,
  },
  {
    title: '启用',
    dataIndex: 'status',
    key: 'status',
    width: 120,
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
    width: 180,
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    width: 220,
  },
];

const showApproval = (record, type) => {
  if (record.id) {
    router.push({
      path: `/goodsManage/good-detail/${type}/${record.id}`,
    });
  } else {
    router.push({
      path: `/goodsManage/goods-list/add`,
    });
  }
};

const changeStatus = (record, checked) => {
  record.loading = true;
  UpdateGoods({
    ...record,
    skuParams: record.skuVos,
    categoryId: record.categoryVos.slice(-1)[0].id,
    status: checked ? 1 : 0,
  })
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

const priceCompare = () => {};

const importGoods = () => {
  proxy.$refs.importFileModal.show({ title: '导入商品' });
};

const refresh = () => {
  proxy.$refs.tableRef.refresh();
};

const getCategoryList = () => {
  categoryAll().then((res) => {
    const list = [];
    transformData(res, list);
    productCategoryList.value = list;
  });
};

// 转换类目结构
const transformData = (list, result) => {
  if (list && list.length > 0) {
    list.forEach((item) => {
      const child = { label: item.name, value: item.id, children: [] };
      transformData(item.children, child.children);
      if (child.children.length <= 0) {
        delete child.children;
      }
      result.push(child);
    });
  }
};
onMounted(() => {
  getCategoryList();
});
</script>

<style lang="less" scoped></style>
