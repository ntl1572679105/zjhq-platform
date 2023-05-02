<template>
  <PageContainer>
    <div>
      <CommonTitleAction title="采购需求处理管理" />
      <TableSearch
        ref="tableRef"
        :formItems="formItems"
        :formData="formData"
        :columns="columns"
        :scroll="{ x: 1380 }"
        :api="demandList"
        :setupParams="setupParams"
      >
        <template #cell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="showDetail(record, 4)">查看</a>
              <a v-if="record.acceptStatus === 0" @click="showApproval(record)">受理</a>
            </a-space>
          </template>
          <template v-else-if="column.key === 'acceptStatus'">
            {{ acceptStatusName(text) }}
          </template>
          <template v-else-if="column.key === 'acceptWay'">
            {{ acceptWayName(text) }}
          </template>
        </template>
      </TableSearch>
      <AssignDealModal ref="assignDealModal" @finish="refresh" />
    </div>
  </PageContainer>
</template>

<script setup>
import { getCurrentInstance, computed, ref, onMounted } from 'vue';
import CommonTitleAction from '@/components/CommonTitleAction/index.vue';
import TableSearch from '@/components/TableSearch/index.vue';
import { demandList } from '@/api/agent/demand';
import { deptTree } from '@/api/erp/dept.js';
import { useRouter } from 'vue-router';
import AssignDealModal from './components/AssignDealModal.vue';

const { proxy } = getCurrentInstance();
const router = useRouter();

const formItems = ref([
  {
    type: 'text',
    label: '需求编号',
    value: 'demandId',
  },
  {
    type: 'text',
    label: '需求标题',
    value: 'title',
  },
  {
    type: 'text',
    label: '申请人',
    value: 'demandCreateBy',
  },
  {
    type: 'cascader',
    label: '申请部门',
    value: 'createDept',
    options: [],
    changeOnSelect: true,
  },
  {
    type: 'select',
    label: '受理状态',
    value: 'acceptStatus',
    options: [
      { label: '待受理', value: 0 },
      { label: '已受理', value: 1 },
    ],
  },
]);

const formData = {
  demandId: undefined,
  title: undefined,
  demandCreateBy: undefined,
  createDept: undefined,
  acceptStatus: undefined,
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
    dataIndex: 'demandId',
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
    dataIndex: 'demandCreateBy',
    width: 140,
    ellipsis: true,
  },
  {
    title: '分配人',
    dataIndex: 'assignMan',
    width: 140,
    ellipsis: true,
  },
  {
    title: '受理状态',
    dataIndex: 'acceptStatus',
    key: 'acceptStatus',
    width: 120,
  },
  {
    title: '受理人',
    dataIndex: 'acceptMan',
    width: 140,
    ellipsis: true,
  },
  {
    title: '受理方式',
    dataIndex: 'acceptWay',
    key: 'acceptWay',
    width: 120,
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    width: 140,
  },
];

const acceptStatusName = computed(() => {
  return (value) => {
    return ['待受理', '已受理'][value] ?? '';
  };
});

const acceptWayName = computed(() => {
  return (value) => {
    return ['转订单', '转询价', '转招标', '已作废'][value] ?? '';
  };
});

const showDetail = (record, type) => {
  router.push({ path: `/purchasingManagement/assign-deal-list/${type}/${record.demandId}` });
};
const showApproval = (record) => {
  proxy.$refs.assignDealModal.show({ id: record.id });
};

const refresh = () => {
  proxy.$refs.tableRef.refresh();
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
