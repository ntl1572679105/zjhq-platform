<template>
  <PageContainer>
    <a-card :bordered="false">
      <FormSearch
        :formItems="formItems"
        :formData="formState"
        @searchForm="searchForm"
        @clearForm="clearForm"
      ></FormSearch>

      <div class="table-operator">
        <a-button type="primary" @click="handleAdd" v-permission="['adminManage:add']">
          新建用户
        </a-button>
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
            <a-space>
              <a @click="handleEdit(record)" v-permission="['adminManage:update']">编辑</a>
              <a @click="resetPwd(record)" v-permission="['adminManage:resetPwd']">重置密码</a>
              <a
                @click="deleteSub(record)"
                style="color: #ff4d4f"
                v-permission="['adminManage:delete']"
                >删除</a
              >
            </a-space>
          </template>
          <template v-else-if="column.key === 'status'">
            <span>{{ text === 0 ? '正常' : '停用' }}</span>
          </template>
        </template>
      </a-table>

      <UserModal ref="userModal" @finish="modalOk" />
      <ResetModal ref="resetModal" />
    </a-card>
  </PageContainer>
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance } from 'vue';
import { FormSearch } from '@/components';
import { userList, userDelete, userDetail } from '@/api/user.js';
import { roleList } from '@/api/erp/common.js';
import { deptTree } from '@/api/erp/dept.js';
import UserModal from './components/UserModal.vue';
import ResetModal from './components/ResetModal.vue';

const { proxy } = getCurrentInstance();
const columns = [
  {
    title: '序号',
    customRender: ({ index }) => `${index + 1}`,
  },
  {
    title: '用户名',
    dataIndex: 'userName',
  },
  {
    title: '手机号码',
    dataIndex: 'phone',
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
    align: 'center',
  },
];

const formItems = [
  {
    type: 'text',
    label: '用户名',
    value: 'userName',
    width: 5,
  },
  {
    type: 'text',
    label: '手机号码',
    value: 'phone',
    width: 5,
  },
  {
    type: 'select',
    label: '状态',
    width: 6,
    value: 'status',
    options: [
      { label: '正常', value: 0 },
      { label: '停用', value: 1 },
    ],
  },
];

const formState = reactive({
  userName: '',
  phone: '',
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
  getRoleList();
  getDeptList();
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
  userList(requestParameters)
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

// 删除
const deleteSub = (record) => {
  proxy.$confirm({
    title: `确认删除该用户？`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      userDelete(record.id).then(() => {
        proxy.$message.success('删除成功');
        getList(dataSource.params);
      });
    },
  });
};
const resetPwd = (record) => {
  proxy.$refs.resetModal.show(record);
};
// 新增、修改
const handleAdd = () => {
  proxy.$refs.userModal.show({ title: '新建' }, roleOptions.value, deptState.list);
};
const handleEdit = (record) => {
  userDetail(record.id).then((res) => {
    proxy.$refs.userModal.show(
      {
        title: '编辑',
        ...res,
        roleIdList: res.roles.map((item) => item.id),
        deptIds: getDeptIds(res.deptId),
      },
      roleOptions.value,
      deptState.list,
    );
  });
};
const modalOk = () => {
  getList(dataSource.params);
};

// 角色列表
const roleOptions = ref([]);
const getRoleList = () => {
  roleList().then((res) => {
    roleOptions.value = res;
  });
};

// 部门数据
const deptState = reactive({
  list: [],
  ob: null, // {id: item}, 用以根据id递归获取父部门
});
const getDeptList = () => {
  deptTree().then((res) => {
    const list = res;
    const ob = {};
    dataClean(list, ob);
    deptState.list = list;
    deptState.ob = ob;
  });
};

const dataClean = (list, ob) => {
  list.forEach((item) => {
    ob[item.id] = item;
    item.label = item.name;
    item.value = item.id;
    if (item.children) {
      if (item.children.length === 0) {
        delete item.children;
      } else {
        dataClean(item.children, ob);
      }
    }
  });
};

const getDeptIds = (id) => {
  if (!id || id === '0') {
    return [];
  } else {
    const getNextId = (curId, list) => {
      if (!curId || curId === '0') {
        // 根节点
        return;
      }
      list.push(curId);
      getNextId(deptState.ob[curId]?.parentId, list);
    };
    const ids = [];
    getNextId(id, ids);
    return ids.reverse();
  }
};
</script>
