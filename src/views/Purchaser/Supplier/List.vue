<template>
  <PageContainer>
    <div>
      <CommonTitleAction title="供应商资质审核">
        <template #right>
          <a-space>
            <!-- <a-button type="primary" @click="invitationList()">邀请列表</a-button> -->
            <a-button type="primary" @click="showDetail()">供应商准入</a-button>
            <a-button type="primary" @click.stop="invitationCode">邀请注册</a-button>
          </a-space>
        </template>
      </CommonTitleAction>
      <TableSearch
        ref="tableRef"
        :formItems="formItems"
        :formData="formData"
        :columns="columns"
        :scroll="{ x: 1400 }"
        :api="supplierList"
        :setupParams="setupParams"
      >
        <template #cell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="showDetail(record, 1)">查看</a>
              <a v-if="record.approvalStatus === 2" @click="showDetail(record, 2)">编辑</a>
              <a-button
                type="link"
                v-if="record.approvalStatus === 0 && record.businessKey"
                @click="showApproval(record)"
                :loading="record.loading"
                >资质审核</a-button
              >
              <a-button
                type="link"
                v-if="record.approvalStatus === 0 && !record.businessKey"
                @click="showApproval(record)"
                :loading="record.loading"
                >发起审批</a-button
              >
              <a-button
                type="link"
                v-if="record.approvalStatus === 2 && record.businessKey"
                @click="showApproval(record)"
                :loading="record.loading"
                >重新审批</a-button
              >
              <!-- <a @click="deleteSub(record)" style="color: #ff4d4f">删除</a> -->
            </a-space>
          </template>
          <template v-else-if="column.key === 'approvalStatus'">
            <div class="align-center">
              <div :class="['approval', approvalStatusConfig(text).color]"></div>
              <span>{{ approvalStatusConfig(text).value }}</span>
            </div>
          </template>
          <template v-else-if="column.key === 'createType'">
            {{ createTypeName(record.invitationId) }}
          </template>
          <template v-else-if="column.key === 'serviceScope'">
            {{ record.categoryVos.map((item) => item.name).join('，') }}
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
import { supplierList, supplierDelete, supplierRepeat } from '@/api/operator/supplier.js';
import { getIndustryTypeDict } from '@/api/common';
import dayjs from 'dayjs';
import { useRouter } from 'vue-router';

const { proxy } = getCurrentInstance();
const router = useRouter();

const formItems = ref([
  {
    type: 'text',
    label: '供应商名称',
    value: 'name',
  },
  {
    type: 'select',
    label: '认证状态',
    value: 'approvalStatus',
    options: [
      { label: '待审批', value: 0 },
      { label: '已通过', value: 1 },
      { label: '已拒绝', value: 2 },
    ],
  },
  {
    type: 'select',
    label: '行业类型',
    value: 'industryType',
    options: [],
  },
  {
    type: 'datepicker',
    label: '创建时间',
    value: 'createTime',
  },
  {
    type: 'select',
    label: '创建方式',
    value: 'createType',
    options: [
      { label: '自主创建', value: 0 },
      { label: '运营创建', value: 1 },
    ],
  },
]);

const formData = {
  name: undefined,
  approvalStatus: undefined,
  industryType: undefined,
  createTime: undefined,
  createType: undefined,
};

const setupParams = (data) => {
  console.log(data);
  const requestParameters = {};
  if (data && data.createTime) {
    requestParameters.createTime = dayjs(data.createTime).format('YYYY-MM-DD');
  }
  return requestParameters;
};

const columns = [
  {
    title: '供应商编号',
    dataIndex: 'id',
    width: 200,
  },
  {
    title: '供应商名称',
    dataIndex: 'name',
    ellipsis: true,
    width: 180,
  },
  // {
  //   title: '社会统一信用代码',
  //   dataIndex: 'uniformCreditCode',
  //   width: 200,
  // },
  {
    title: '行业类型',
    dataIndex: 'industryType',
    width: 180,
    ellipsis: true,
  },
  {
    title: '服务范围',
    key: 'serviceScope',
    width: 200,
    ellipsis: true,
  },
  {
    title: '认证状态',
    dataIndex: 'approvalStatus',
    key: 'approvalStatus',
    width: 120,
  },
  {
    title: '创建方式',
    key: 'createType',
    width: 120,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 180,
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    width: 220,
  },
];

const createTypeName = computed(() => {
  return (value) => {
    return value ? '自主创建' : '运营创建'; // ['自主创建', '运营创建'][value] || '-';
  };
});

const approvalStatusConfig = computed(() => {
  return (value) => {
    return (
      [
        { value: '待审批', color: 'approval0' },
        { value: '已通过', color: 'approval1' },
        { value: '已拒绝', color: 'approval2' },
      ][value] || { value: '-' }
    );
  };
});

const invitationCode = () => {
  router.push({ path: '/purchaser/supplier/invitationList' });
};
const showDetail = (record, type) => {
  if (record) {
    router.push({ path: `/purchaser/supplier/${type}/${record.id}` });
  } else {
    router.push({ path: '/purchaser/supplier/add' });
  }
};
const showApproval = (record) => {
  if (record.approvalStatus === 0 && record.businessKey) {
    router.push({ path: `/purchaser/supplier/3/${record.id}` });
  } else {
    record.loading = true;
    supplierRepeat(record.id)
      .then(() => {
        proxy.$message.success('重开成功');
        proxy.$refs.tableRef.refresh();
      })
      .finally(() => {
        record.loading = false;
      });
  }
};

const deleteSub = (record) => {
  proxy.$confirm({
    title: `确定删除?`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      supplierDelete(record.id).then(() => {
        proxy.$message.success('删除成功');
        proxy.$refs.tableRef.refresh();
      });
    },
  });
};

onMounted(() => {
  industryTypeDict();
});

// 字典
const industryTypeDict = () => {
  getIndustryTypeDict().then((res) => {
    formItems.value[2].options = res.map((item) => ({ label: item.dictKey, value: item.dictKey }));
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
</style>
