<template>
  <PageContainer>
    <div>
      <CommonTitleAction title="合同管理">
        <template #right>
          <a-button type="primary" @click="showDetail({ status: 0 }, 0)">新建合同</a-button>
        </template>
      </CommonTitleAction>
      <TableSearch
        ref="tableRef"
        :formItems="formItems"
        :formData="formData"
        :columns="columns"
        :scroll="{ x: 1100 }"
        :api="contractCategoryPage"
      >
        <template #cell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="showDetail(record, 1)">查看</a>
              <a @click="showDetail(record, 2)">编辑</a>
              <a @click="deleteSub(record)" style="color: #ff4d4f">删除</a>
            </a-space>
          </template>
          <template v-else-if="column.key === 'status'">
            <a-switch
              v-model:checked="record.status"
              :checkedValue="0"
              :unCheckedValue="1"
              @change="(checked) => changeStatus(record, checked)"
              :loading="record.loading"
            />
          </template>
        </template>
      </TableSearch>
      <CategoryModal ref="categoryModal" @finish="refresh" />
    </div>
  </PageContainer>
</template>

<script setup>
import { getCurrentInstance, ref, onMounted } from 'vue';
import CommonTitleAction from '@/components/CommonTitleAction/index.vue';
import TableSearch from '@/components/TableSearch/index.vue';
import {
  contractCategoryPage,
  contractCategoryDelete,
  contractCategoryEdit,
} from '@/api/operator/contract.js';
import { contractList } from '@/api/common';
import CategoryModal from './compontents/CategoryModal.vue';

const { proxy } = getCurrentInstance();

const formItems = ref([
  {
    type: 'select',
    label: '合同类型',
    value: 'parentId',
    options: [],
  },
]);

const formData = {
  parentId: undefined,
};

const columns = [
  {
    title: '序号',
    customRender: ({ index }) => `${index + 1}`,
    width: 100,
  },
  {
    title: '合同名称',
    dataIndex: 'name',
    ellipsis: true,
    width: 200,
  },
  {
    title: '创建人',
    dataIndex: 'person',
    width: 200,
    ellipsis: true,
  },
  {
    title: '创建日期',
    dataIndex: 'createTime',
    width: 200,
  },
  {
    title: '启用',
    dataIndex: 'status',
    key: 'status',
    width: 180,
    ellipsis: true,
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    width: 220,
  },
];

const showDetail = (record, type) => {
  proxy.$refs.categoryModal.show(record, type, formItems.value[0].options);
};

const changeStatus = (record, checked) => {
  record.loading = true;
  contractCategoryEdit({ ...record, status: checked ? 1 : 0 })
    .then(() => {
      proxy.$message.success('状态修改成功');
      record.status = checked ? 1 : 0;
    })
    .catch(() => {
      proxy.$message.warning('状态修改失败');
      record.status = checked ? 0 : 1;
    })
    .finally(() => {
      record.loading = false;
    });
};

const deleteSub = (record) => {
  proxy.$confirm({
    title: `确定删除?`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      contractCategoryDelete(record.id).then(() => {
        proxy.$message.success('删除成功');
        proxy.$refs.tableRef.refresh();
      });
    },
  });
};

const refresh = () => {
  proxy.$refs.tableRef.refresh();
};

onMounted(() => {
  getTypeList();
});

const getTypeList = () => {
  contractList().then((res) => {
    formItems.value[0].options = res.map((item) => ({ label: item.name, value: item.id }));
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
