<template>
  <PageContainer>
    <div>
      <CommonTitleAction title="商品比价">
        <template #right>
          <a-button type="primary" v-permission="['operator:productCompare:add']" @click="showAdd">
            新增比价
          </a-button>
        </template>
      </CommonTitleAction>
      <TableSearch
        ref="tableRef"
        :formItems="formItems"
        :formData="formData"
        :columns="columns"
        :scroll="{ x: 1450 }"
        :api="CompareList"
        :setupParams="setupParams"
      >
        <template #cell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="showDetail(record)">查看</a>
            </a-space>
          </template>
          <template v-else-if="column.dataIndex === 'categoryVos'">
            {{ record.categoryVos.map((item) => item.name).join('/') }}
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
            ></a-switch>
          </template>
        </template>
      </TableSearch>
      <CompareModal ref="compareModal" @finish="modalOk" />
      <CompareDetailModal ref="compareDetailModal" />
    </div>
  </PageContainer>
</template>

<script setup>
import { getCurrentInstance, ref, onMounted } from 'vue';
import CommonTitleAction from '@/components/CommonTitleAction/index.vue';
import TableSearch from '@/components/TableSearch/index.vue';
import { CompareList, updateProductCompare } from '@/api/goods.js';
import { getPriceSourceDict, categoryAll } from '@/api/common';
import CompareModal from './components/CompareModal.vue';
import CompareDetailModal from './components/CompareDetailModal.vue';

const { proxy } = getCurrentInstance();

const productCategoryList = ref([]);

const formItems = ref([
  {
    type: 'text',
    label: '商品编号',
    value: 'productId',
  },
  {
    type: 'text',
    label: '商品名称',
    value: 'name',
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
  {
    type: 'select',
    label: '价格来源',
    value: 'source',
    options: [],
  },
]);

const formData = {
  productId: undefined,
  name: undefined,
  status: undefined,
  categoryIds: undefined,
  source: undefined,
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
    dataIndex: 'productId',
    width: 200,
  },
  {
    title: '商品名称',
    dataIndex: 'name',
    ellipsis: true,
    width: 180,
  },
  {
    title: '商品类型',
    dataIndex: 'categoryVos',
    width: 250,
    ellipsis: true,
  },
  {
    title: '规格编号',
    dataIndex: 'skuId',
    ellipsis: true,
    width: 200,
  },
  {
    title: '规格',
    dataIndex: 'attributeDTO',
    key: 'sku',
    ellipsis: true,
    width: 200,
  },
  {
    title: '单位',
    dataIndex: 'unit',
    width: 200,
    ellipsis: true,
  },
  {
    title: '启用',
    dataIndex: 'status',
    key: 'status',
    width: 120,
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    width: 100,
  },
];

const showDetail = (record) => {
  proxy.$refs.compareDetailModal.show(record);
};

const showAdd = () => {
  proxy.$refs.compareModal.show({});
};

const changeStatus = (record, checked) => {
  record.loading = true;
  updateProductCompare({ ...record, status: checked ? 1 : 0 })
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

const modalOk = () => {
  proxy.$refs.tableRef.refresh();
};

const getCategoryList = () => {
  categoryAll().then((res) => {
    const list = [];
    transformData(res, list);
    productCategoryList.value = list;
  });
};

// 获取字典内容
const getDict = () => {
  getPriceSourceDict().then((res) => {
    formItems.value[4].options = res.map((item) => ({
      label: item.dictKey,
      value: item.dictKey,
    }));
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
  getDict();
});
</script>

<style lang="less" scoped>
.approval {
  position: relative;
  // padding-left: 16px;
  margin-right: 5px;
  width: 12px;
  height: 12px;
  border-radius: 3px;

  &::before {
    content: ' ';
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    left: 0px;
    top: 0px;
    right: 0;
    bottom: 0;
    margin: auto;
  }
}

.approval0 {
  border: 1px solid #1b77ff;

  &::before {
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
    background: #f22933;
  }
}
</style>
