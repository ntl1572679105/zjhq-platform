<template>
  <PageContainer>
    <div>
      <CommonTitleAction title="合格供应商管理" />
      <TableSearch
        ref="tableRef"
        :formItems="formItems"
        :formData="formData"
        :columns="columns"
        :scroll="{ x: 1600 }"
        :api="supplierQualifiedList"
      >
        <template #cell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" @click="showDetail(record, 1)">查看</a-button>
              <template v-if="record.lastApply === null">
                <a-button
                  type="link"
                  @click="handleApproval(record, 2)"
                  style="color: #ff4d4f"
                  :loading="record.loading"
                  >淘汰</a-button
                >
                <a-button type="link" @click="handleApproval(record, 1)" :loading="record.loading"
                  >启用</a-button
                >
              </template>
              <a-button
                type="link"
                v-if="record.status === 2"
                style="color: #ff4d4f"
                @click="handleApproval(record, 2)"
                :loading="record.loading"
                >淘汰</a-button
              >
              <a-button
                type="link"
                v-else-if="record.status === 3"
                @click="handleApproval(record, 1)"
                :loading="record.loading"
                >启用</a-button
              >
              <a
                type="link"
                v-if="record.lastApply && record.lastApply.status === 0"
                @click="showDetail(record, 2)"
                >{{ record.lastApply.type === 1 ? '启用' : '淘汰' }}审批</a
              >
            </a-space>
          </template>
          <template v-else-if="column.key === 'status'">
            <div class="align-center">
              <div :class="['approval', statusConfig(text).color]"></div>
              <span>{{ statusConfig(text).value }}</span>
            </div>
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
import { supplierQualifiedList, supplierQualifiedApply } from '@/api/operator/supplier.js';
import { getIndustryTypeDict, getRatingDict } from '@/api/common';
import { useRouter } from 'vue-router';

const { proxy } = getCurrentInstance();
const router = useRouter();

const formItems = ref([
  {
    type: 'text',
    label: '供应商编号',
    value: 'id',
  },
  {
    type: 'text',
    label: '供应商名称',
    value: 'name',
  },
  {
    type: 'select',
    label: '行业类型',
    value: 'industryType',
    options: [],
  },
  {
    type: 'select',
    label: '状态',
    value: 'status',
    // 状态 0-入围审核 1-已入围 2-合格 3-淘汰
    options: [
      // { label: '入围审核', value: 0 },
      { label: '待提交', value: 1 },
      { label: '合格', value: 2 },
      { label: '淘汰', value: 3 },
    ],
  },
  // {
  //   type: 'select',
  //   label: '认证服务品类',
  //   value: 'rating',
  //   options: [],
  // },
]);

const formData = {
  id: undefined,
  name: undefined,
  industryType: undefined,
  status: undefined,
  // rating: undefined,
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
  {
    title: '行业类型',
    dataIndex: 'industryType',
    width: 180,
    ellipsis: true,
  },
  {
    title: '认证服务品类',
    key: 'serviceScope',
    width: 200,
    ellipsis: true,
  },
  // {
  //   title: '评分',
  //   dataIndex: 'serviceScope',
  //   width: 200,
  //   ellipsis: true,
  // },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 120,
  },
  {
    title: '状态变更时间',
    dataIndex: 'updateTime',
    width: 180,
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    width: 220,
  },
];

const handleApproval = (record, type) => {
  const text = type === 1 ? '启用' : '淘汰';
  proxy.$confirm({
    title: `确定发起该供应商${text}申请?`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      record.loading = true;
      supplierQualifiedApply({ supplierId: record.id, type })
        .then(() => {
          proxy.$message.success(`${text}申请成功，待审核`);
          proxy.$refs.tableRef.refresh();
        })
        .finally(() => {
          record.loading = false;
        });
    },
  });
};

const showDetail = (record, type) => {
  router.push({
    path: `/qualifiedSupplierDetail/${type}/${record.id}`,
  });
};
onMounted(() => {
  industryTypeDict();
  // ratingDict();
});

// 字典
const industryTypeDict = () => {
  getIndustryTypeDict().then((res) => {
    formItems.value[2].options = res.map((item) => ({ label: item.dictKey, value: item.dictKey }));
  });
};
// // 字典
// const ratingDict = () => {
//   getRatingDict().then((res) => {
//     formItems.value[4].options = res.map((item) => ({ label: item.dictKey, value: item.dictKey }));
//   });
// };

const statusConfig = computed(() => {
  return (value) => {
    return (
      [
        { value: '', color: 'approval' },
        { value: '待提交', color: 'approval0' },
        { value: '合格', color: 'approval1' },
        { value: '淘汰', color: 'approval2' },
      ][value] || { value: '-' }
    );
  };
});
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
