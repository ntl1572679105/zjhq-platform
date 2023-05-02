<template>
  <PageContainer>
    <a-card :bordered="false">
      <FormSearch
        :formItems="formItems"
        :formData="formState"
        @searchForm="searchForm"
        @clearForm="clearForm"
      >
      </FormSearch>
      <div class="table-operator">
        <a-button type="primary" @click="handleAdd" v-permission="['system:role:add']"
          >新建角色</a-button
        >
      </div>

      <a-table
        ref="table"
        size="default"
        row-key="id"
        :columns="columns"
        :data-source="dataSource.list"
        :loading="loading"
        :pagination="pagination"
        @change="tableChange"
      >
        <template #bodyCell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space v-if="!record.admin">
              <a @click="handleEdit(record)" v-permission="['system:role:edit']">编辑</a>
              <a
                @click="deleteSub(record)"
                style="color: #ff4d4f"
                v-permission="['system:role:remove']"
                >删除</a
              >
            </a-space>
          </template>
          <template v-else-if="column.key === 'status'">
            {{ textStatus(text) }}
          </template>
        </template>
      </a-table>
      <RoleModal ref="roleModal" @finish="modalOk" />
    </a-card>
  </PageContainer>
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance, computed } from 'vue';
import { FormSearch } from '@/components';
import { roleList, roleDetail, roleDelete } from '@/api/role.js';
import RoleModal from './components/RoleModal.vue';

const { proxy } = getCurrentInstance();
const columns = [
  {
    title: '序号',
    customRender: ({ index }) => `${index + 1}`,
  },
  {
    title: '角色名称',
    dataIndex: 'roleName',
  },
  {
    title: '角色字符',
    dataIndex: 'roleKey',
  },
  {
    title: '显示顺序',
    dataIndex: 'roleSort',
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
    key: 'action',
  },
];

const formItems = [
  {
    type: 'text',
    label: '角色名称',
    value: 'roleName',
  },
  {
    type: 'select',
    label: '状态',
    value: 'status',
    options: [
      { label: '正常', value: 0 },
      { label: '停用', value: 1 },
    ],
  },
];
const textStatus = computed(() => {
  return (value) => {
    return ['正常', '停用'][value];
  };
});

const formState = reactive({
  roleName: '',
  status: undefined,
});

const loading = ref(false);
const dataSource = reactive({
  list: [],
  params: {},
});
const pagination = reactive({
  hideOnSinglePage: true,
  pageSize: 10,
  total: 0,
  current: 1,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50'],
});

onMounted(() => {
  searchForm();
});

// 表单搜索回调
const searchForm = (formData) => {
  pagination.current = 1;
  dataSource.params = formData;
  getList(formData);
};

const clearForm = () => {
  pagination.current = 1;
  dataSource.params = {};
  searchForm();
};

const getList = (formData) => {
  loading.value = true;
  const requestParameters = Object.assign(
    { pageNum: pagination.current, pageSize: pagination.pageSize },
    formData,
  );
  // console.log('loadData request parameters:', requestParameters);
  roleList(requestParameters)
    .then((res) => {
      dataSource.list = res.data;
      pagination.total = res.total;
    })
    .finally(() => {
      loading.value = false;
    });
};

/// 逻辑操作
// 分页
const tableChange = (page) => {
  pagination.current = page.current;
  pagination.pageSize = page.pageSize;
  getList(dataSource.params);
};

const handleAdd = () => {
  proxy.$refs.roleModal.show({ title: '添加' });
};
const handleEdit = (record) => {
  roleDetail(record.id).then((res) => {
    proxy.$refs.roleModal.show({ title: '编辑', ...res });
  });
};
const deleteSub = (record) => {
  proxy.$confirm({
    title: `确认删除该角色？`,
    okText: '确顶',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      roleDelete(record.id).then(() => {
        proxy.$message.success('删除成功');
        modalOk();
      });
    },
  });
};
const modalOk = () => {
  getList(dataSource.params);
};
</script>
