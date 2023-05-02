<template>
  <PageContainer>
    <a-card :bordered="false">
      <div class="table-operator">
        <a-button type="primary" @click="handleAdd"> 新增部门 </a-button>
      </div>
      <a-table
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource.list"
        :loading="loading"
        :pagination="false"
      >
        <template #bodyCell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a v-if="record.menuType !== 'F'" @click="handleAdd(record)">添加</a>
              <a @click="handleEdit(record)">编辑</a>
              <a @click="deleteSub(record)" style="color: #ff4d4f">删除</a>
            </a-space>
          </template>
        </template>
      </a-table>
      <DeptModal ref="deptModal" @finish="modalOk" />
    </a-card>
  </PageContainer>
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance } from 'vue';
import DeptModal from './components/DeptModal.vue';
import { deptTree, deptDelete } from '@/api/erp/dept.js';

const { proxy } = getCurrentInstance();
const columns = [
  {
    title: '部门名称',
    dataIndex: 'name',
  },
  {
    title: '排序',
    dataIndex: 'sort',
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    width: 180,
  },
];

const loading = ref(false);
const dataSource = reactive({
  list: [],
});
onMounted(() => {
  getList();
});

const getList = () => {
  loading.value = true;
  deptTree()
    .then((res) => {
      const list = res;
      dataClean(list, []);
      dataSource.list = list;
    })
    .finally(() => {
      loading.value = false;
    });
};

// 数据清理：1.删除空children 2.赋值级联ids
const dataClean = (list, parentIds) => {
  list.forEach((item) => {
    item.ids = [...parentIds, item.id];
    item.label = item.name;
    item.value = item.id;
    if (item.children) {
      if (item.children.length === 0) {
        delete item.children;
      } else {
        dataClean(item.children, item.ids);
      }
    }
  });
};

const deleteSub = (record) => {
  proxy.$confirm({
    title: `确定删除-${record.name}？`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      deptDelete(record.id).then(() => {
        proxy.$message.success('删除成功');
        getList();
      });
    },
  });
};
const handleAdd = (record) => {
  proxy.$refs.deptModal.show({
    title: '新增',
    list: dataSource.list,
    ids: record ? record.ids : null,
  });
};
const handleEdit = (record) => {
  proxy.$refs.deptModal.show({
    title: '编辑',
    ...record,
    list: dataSource.list,
    ids: record.ids.slice(0, record.ids.length - 1),
  });
};
const modalOk = () => {
  getList();
};
</script>

<style lang="less" scoped></style>
