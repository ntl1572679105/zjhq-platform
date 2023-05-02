<template>
  <PageContainer>
    <div>
      <CommonTitleAction title="机构列表">
        <template #right>
          <a-button type="primary" @click="showDetail()">添加机构</a-button>
        </template>
      </CommonTitleAction>
      <TableSearch
        ref="tableRef"
        :formItems="formItems"
        :formData="formData"
        :columns="columns"
        :scroll="{ x: 1500 }"
        :api="agentPage"
      >
        <template #cell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="showDetail(record)">详情</a>
              <a v-if="record.status === 0" @click="deleteSub(record)">淘汰</a>
            </a-space>
          </template>
          <template v-else-if="column.key === 'status'">
            <div class="align-center">
              <div :class="['approval', statusConfig(text).color]"></div>
              <span>{{ statusConfig(text).value }}</span>
            </div>
          </template>
        </template>
      </TableSearch>
    </div>
  </PageContainer>
</template>

<script setup>
import { getCurrentInstance, computed, ref } from 'vue';
import CommonTitleAction from '@/components/CommonTitleAction/index.vue';
import TableSearch from '@/components/TableSearch/index.vue';
import { agentPage, agentEliminate } from '@/api/operator/agent.js';
import { useRouter } from 'vue-router';

const { proxy } = getCurrentInstance();
const router = useRouter();

const formItems = ref([
  {
    type: 'text',
    label: '机构名称',
    value: 'name',
  },
  {
    type: 'text',
    label: '联系人',
    value: 'linkman',
  },
  {
    type: 'text',
    label: '联系电话',
    value: 'linkmanPhone',
  },
]);

const formData = {
  name: undefined,
  linkman: undefined,
  linkmanPhone: undefined,
};

const columns = [
  {
    title: '机构编号',
    dataIndex: 'id',
    width: 200,
  },
  {
    title: '机构名称',
    dataIndex: 'name',
    ellipsis: true,
    width: 180,
  },
  {
    title: '社会统一信用代码',
    dataIndex: 'uniformCreditCode',
    width: 200,
  },
  {
    title: '代理项目数',
    dataIndex: 'agentProjectNum',
    width: 120,
    ellipsis: true,
  },
  {
    title: '联系人',
    dataIndex: 'linkman',
    width: 200,
    ellipsis: true,
  },
  {
    title: '联系电话',
    dataIndex: 'linkmanPhone',
    width: 160,
    ellipsis: true,
  },
  {
    title: '邮箱',
    dataIndex: 'linkmanEmail',
    width: 180,
    ellipsis: true,
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

const statusConfig = computed(() => {
  return (value) => {
    return (
      [
        { value: '使用中', color: 'approval1' },
        { value: '已淘汰', color: 'approval2' },
      ][value] || { value: '-' }
    );
  };
});

const showDetail = (record) => {
  if (record) {
    router.push({ path: `/operator/agent/${record.id}` });
  } else {
    router.push({ path: '/operator/agent/add' });
  }
};

const deleteSub = (record) => {
  proxy.$confirm({
    title: `确定淘汰-${record.name}?`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      agentEliminate(record.id).then(() => {
        proxy.$message.success('淘汰成功');
        proxy.$refs.tableRef.refresh();
      });
    },
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
