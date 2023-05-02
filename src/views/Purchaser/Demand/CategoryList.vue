<template>
  <PageContainer>
    <a-card :bordered="false">
      <div class="table-operator">
        <a-button type="primary" @click="handleAdd"> 新增一级类目 </a-button>
      </div>
      <a-table
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :pagination="false"
        :dataSource="dataSource.list"
        :loading="loading"
      >
        <template #bodyCell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="handleAdd(record)">添加子集</a>
              <a @click="handleEdit(record)">编辑</a>
              <a @click="deleteSub(record)" style="color: #ff4d4f">删除</a>
              <a @click="handleSpce(record)">规格</a>
            </a-space>
          </template>
          <template v-else-if="column.key === 'img'">
            <a-image :width="40" :src="text" v-if="text" />
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
          <template v-else-if="column.key === 'tooltip'">
            <a-tooltip>
              <template #title>{{ text }}</template>
              {{ text }}
            </a-tooltip>
          </template>
        </template>
      </a-table>
      <CategoryListModal ref="categoryListModal" @finish="modalOk" />
      <SpecModal ref="specModal" />
    </a-card>
  </PageContainer>
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance } from 'vue';
import {
  categoryAll,
  categoryDetail,
  categoryDelete,
  categoryEdit,
} from '@/api/operator/demand.js';
import CategoryListModal from './components/CategoryListModal.vue';
import SpecModal from './components/SpecModal.vue';

const { proxy } = getCurrentInstance();
const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    width: '25%',
    ellipsis: true,
    key: 'tooltip',
  },
  {
    title: '展示图片',
    dataIndex: 'imgUrl',
    key: 'img',
    with: '15%',
  },
  {
    title: '排序',
    dataIndex: 'sort',
    width: '10%',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: '25%',
    align: 'right',
  },
  {
    title: '操作',
    key: 'action',
    width: '25%',
    align: 'center',
  },
];

const loading = ref(false);
const dataSource = reactive({
  list: [],
  params: {},
});
onMounted(() => {
  getList();
});

const getList = () => {
  loading.value = true;
  categoryAll()
    .then((res) => {
      const list = res;
      menuDataClean(list, []);
      dataSource.list = list;
    })
    .finally(() => {
      loading.value = false;
    });
};

// 菜单数据清理：1.删除空children 2.赋值级联菜单ids
const menuDataClean = (list, parentMenuIds) => {
  list.forEach((item) => {
    item.menuIds = [...parentMenuIds, item.id];
    item.label = item.name;
    item.value = item.id;
    if (item.children) {
      if (item.children.length === 0) {
        delete item.children;
      } else {
        menuDataClean(item.children, item.menuIds);
      }
    }
  });
};

const changeStatus = (record, checked) => {
  record.loading = true;
  categoryEdit({ ...record, status: checked ? 1 : 0 })
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
    title: `确认删除该类目-${record.name}吗?`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      categoryDelete(record.id).then(() => {
        proxy.$message.success('删除成功');
        getList();
      });
    },
  });
};
const handleAdd = (record) => {
  proxy.$refs.categoryListModal.show({
    title: '添加',
    menus: dataSource.list,
    menuIds: record ? record.menuIds : null,
  });
};

const handleEdit = (record) => {
  proxy.$refs.categoryListModal.show({
    title: '修改',
    ...record,
    menus: dataSource.list,
    menuIds: record.menuIds.slice(0, record.menuIds.length - 1),
  });
};

const handleSpce = (record) => {
  categoryDetail(record.id).then((res) => {
    proxy.$refs.specModal.show({ specList: res.specList || [], categoryId: res.id });
  });
};

const modalOk = () => {
  getList();
};
</script>

<style lang="less" scoped></style>
