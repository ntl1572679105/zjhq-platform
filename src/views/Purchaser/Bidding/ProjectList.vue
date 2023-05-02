<template>
  <PageContainer>
    <div>
      <CommonTitleAction title="可转招标项目列表">
        <template #right>
          <a-button
            type="primary"
            :disabled="!(state.selectedRowKeys.length > 0)"
            @click="transferAction()"
            :loading="state.loading"
            >发起招标</a-button
          >
        </template>
      </CommonTitleAction>
      <TableSearch
        ref="tableRef"
        :formItems="formItems"
        :formData="formData"
        :columns="columns"
        :scroll="{ x: 900 }"
        :api="projectPage"
        :setupParams="setupParams"
        :rowSelection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
      >
        <template #cell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="showDetail(record, 1)">查看</a>
              <a-button type="link" @click="transferAction(record)" :loading="record.loading"
                >发起招标</a-button
              >
            </a-space>
          </template>
        </template>
      </TableSearch>
    </div>
  </PageContainer>
</template>

<script setup>
import { getCurrentInstance, ref, onMounted, reactive } from 'vue';
import CommonTitleAction from '@/components/CommonTitleAction/index.vue';
import TableSearch from '@/components/TableSearch/index.vue';
import { deptTree } from '@/api/erp/dept.js';
import { projectPage, projectTransfer } from '@/api/operator/bid.js';
import { useRouter } from 'vue-router';

const { proxy } = getCurrentInstance();
const router = useRouter();

const formItems = ref([
  {
    type: 'text',
    label: '项目编号',
    value: 'id',
  },
  {
    type: 'text',
    label: '项目标题',
    value: 'title',
  },
  {
    type: 'text',
    label: '申请人',
    value: 'createBy',
  },
  {
    type: 'cascader',
    label: '申请部门',
    value: 'createDeptId',
    options: [],
    changeOnSelect: true,
  },
]);

const formData = {
  id: undefined,
  title: undefined,
  createBy: undefined,
  createDeptId: undefined,
};

const setupParams = (data) => {
  console.log(data);
  const requestParameters = {};
  if (data && data.createDeptId) {
    requestParameters.createDeptId = data.createDeptId.slice(-1)[0];
  }
  return requestParameters;
};

const columns = [
  {
    title: '项目编号',
    dataIndex: 'id',
    width: 200,
  },
  {
    title: '项目标题',
    dataIndex: 'title',
    ellipsis: true,
    width: 180,
  },
  {
    title: '申请部门',
    dataIndex: 'createDept',
    width: 200,
    ellipsis: true,
  },
  {
    title: '申请人',
    dataIndex: 'createBy',
    width: 180,
    ellipsis: true,
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    width: 140,
  },
];

const state = reactive({
  selectedRowKeys: [],
  loading: false,
});

const onSelectChange = (selectedRowKeys, selectedRows) => {
  console.log(selectedRowKeys, selectedRows);
  state.selectedRowKeys = selectedRowKeys;
};

const showDetail = (record, type) => {
  if (record) {
    router.push({ path: `/purchasingManagement/project-list/${type}/${record.id}` });
  } else {
    router.push({ path: `/purchasingManagement/project-list/add` });
  }
};

const transferAction = (record) => {
  if (record) {
    record.loading = true;
    projectTransfer({ idList: [record.id] })
      .then(() => {
        proxy.$message.success('发起招标成功');
        proxy.$refs.tableRef.refresh();
      })
      .finally(() => {
        record.loading = false;
      });
  } else {
    state.loading = true;
    projectTransfer({ idList: state.selectedRowKeys })
      .then(() => {
        proxy.$message.success('发起招标成功');
        proxy.$refs.tableRef.refresh();
        state.selectedRowKeys = [];
      })
      .finally(() => {
        state.loading = false;
      });
  }
};

// 获取部门数据
onMounted(() => {
  getList();
});

const getList = () => {
  deptTree().then((res) => {
    const list = res;
    dataClean(list, []);
    formItems.value[3].options = list;
  });
};

const dataClean = (list) => {
  list.forEach((item) => {
    item.label = item.name;
    item.value = item.id;
    if (item.children) {
      if (item.children.length === 0) {
        delete item.children;
      } else {
        dataClean(item.children);
      }
    }
  });
};
</script>

<style lang="less" scoped></style>
