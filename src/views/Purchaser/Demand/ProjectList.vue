<template>
  <PageContainer>
    <div>
      <CommonTitleAction title="采购项目管理">
        <template #right>
          <a-button type="primary" @click="showDetail()">新建</a-button>
        </template>
      </CommonTitleAction>
      <TableSearch
        ref="tableRef"
        :formItems="formItems"
        :formData="formData"
        :columns="columns"
        :scroll="{ x: 1060 }"
        :api="projectPage"
        :setupParams="setupParams"
      >
        <template #cell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="showDetail(record, 1)">查看</a>
              <a
                v-if="record.approvalStatus === -1 || record.approvalStatus === 2"
                @click="showDetail(record, 2)"
                >编辑</a
              >
              <a-button
                v-if="record.approvalStatus === -1"
                type="link"
                @click="showApproval(record)"
                :loading="record.loading"
                >提交审核</a-button
              >
              <a v-else-if="record.approvalStatus === 0" @click="showApproval(record)">审核</a>
              <a-button
                type="link"
                v-else-if="record.approvalStatus === 2"
                @click="showApproval(record)"
                :loading="record.loading"
                >重新提交</a-button
              >
              <a-button
                type="link"
                v-if="record.approvalStatus === 1 && record.isBid === 0"
                @click="transferAction(record)"
                :loading="record.loading"
                >发起招标</a-button
              >
            </a-space>
          </template>
          <template v-else-if="column.key === 'approvalStatus'">
            <div class="align-center">
              <div :class="['approval', approvalStatusConfig(text).color]"></div>
              <span>{{ approvalStatusConfig(text).value }}</span>
            </div>
          </template>
        </template>
      </TableSearch>
    </div>
  </PageContainer>
</template>

<script setup>
import { getCurrentInstance, computed, ref, onMounted } from 'vue';
import CommonTitleAction from '@/components/CommonTitleAction/index.vue';
import TableSearch from '@/components/TableSearch/index.vue';
import { projectPage, projectCommit } from '@/api/operator/project';
import { deptTree } from '@/api/erp/dept.js';
import { projectTransfer } from '@/api/operator/bid.js';
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
  {
    type: 'select',
    label: '审批状态',
    value: 'approvalStatus',
    options: [
      { label: '待提交', value: -1 },
      { label: '待审批', value: 0 },
      { label: '已通过', value: 1 },
      { label: '已拒绝', value: 2 },
    ],
  },
]);

const formData = {
  id: undefined,
  title: undefined,
  createBy: undefined,
  createDeptId: undefined,
  approvalStatus: undefined,
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
    title: '审批状态',
    dataIndex: 'approvalStatus',
    key: 'approvalStatus',
    width: 120,
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    width: 180,
  },
];

const approvalStatusConfig = computed(() => {
  return (value) => {
    if (value === -1) {
      return { value: '待提交', color: 'approval-1' };
    }
    return (
      [
        { value: '待审批', color: 'approval0' },
        { value: '已通过', color: 'approval1' },
        { value: '已拒绝', color: 'approval2' },
      ][value] || { value: '-' }
    );
  };
});

const showDetail = (record, type) => {
  if (record) {
    router.push({ path: `/purchasingManagement/project-list/${type}/${record.id}` });
  } else {
    router.push({ path: `/purchasingManagement/project-list/add` });
  }
};
const showApproval = (record) => {
  if (record.approvalStatus === 0) {
    router.push({ path: `/purchasingManagement/project-list/3/${record.id}` });
  } else {
    record.loading = true;
    projectCommit(record.id)
      .then(() => {
        proxy.$message.success('提交审核成功');
        proxy.$refs.tableRef.refresh();
      })
      .finally(() => {
        record.loading = false;
      });
  }
};

const transferAction = (record) => {
  record.loading = true;
  projectTransfer({ idList: [record.id] })
    .then(() => {
      proxy.$message.success('发起招标成功');
      proxy.$refs.tableRef.refresh();
    })
    .finally(() => {
      record.loading = false;
    });
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
.approval-1 {
  &:before {
    background: rgba(0, 0, 0, 0.85);
  }
}
</style>
