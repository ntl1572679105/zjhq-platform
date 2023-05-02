<template>
  <PageContainer>
    <div>
      <CommonTitleAction title="需求采购管理" />
      <TableSearch
        ref="tableRef"
        :formItems="formItems"
        :formData="formData"
        :columns="columns"
        :scroll="{ x: 1080 }"
        :api="demandPage"
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
              <a-button
                type="link"
                v-else-if="record.approvalStatus === 0"
                @click="showApproval(record)"
                >审核</a-button
              >
              <a-button
                type="link"
                v-else-if="record.approvalStatus === 2"
                @click="showApproval(record)"
                >重新审核</a-button
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
import { demandPage, demandCommit } from '@/api/operator/demand.js';
import { deptTree } from '@/api/erp/dept.js';
import { useRouter } from 'vue-router';

const { proxy } = getCurrentInstance();
const router = useRouter();

const formItems = ref([
  {
    type: 'text',
    label: '需求编号',
    value: 'id',
  },
  {
    type: 'text',
    label: '需求标题',
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
    value: 'createDept',
    options: [],
    changeOnSelect: true,
  },
]);

const formData = {
  id: undefined,
  title: undefined,
  createBy: undefined,
  createDept: undefined,
};

const setupParams = (data) => {
  console.log(data);
  const requestParameters = {};
  if (data && data.createDept) {
    requestParameters.createDept = data.createDept.slice(-1)[0];
  }
  return requestParameters;
};

const columns = [
  {
    title: '需求编号',
    dataIndex: 'id',
    width: 200,
  },
  {
    title: '需求标题',
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
    width: 200,
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
  router.push({ path: `/purchasingManagement/demand-list/${type}/${record.id}` });
};
const showApproval = (record) => {
  if (record.approvalStatus === 0) {
    router.push({ path: `/purchasingManagement/demand-list/3/${record.id}` });
  } else {
    proxy.$confirm({
      content: '请确认是否提交审核',
      onOk() {
        return new Promise((resolve, reject) => {
          record.loading = true;
          demandCommit(record.id)
            .then(() => {
              resolve();
              proxy.$message.success('提交审核成功');
              proxy.$refs.tableRef.refresh();
            })
            .catch(() => reject())
            .finally(() => {
              record.loading = false;
            });
        });
      },
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
