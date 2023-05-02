<template>
  <PageContainer>
    <div>
      <CommonTitleAction title="专家管理">
        <template #right>
          <a-button type="primary" @click="showDetail()">添加专家</a-button>
        </template>
      </CommonTitleAction>
      <TableSearch
        ref="tableRef"
        :formItems="formItems"
        :formData="formData"
        :columns="columns"
        :scroll="{ x: 1460 }"
        :api="expertPage"
      >
        <template #cell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="showDetail(record)">详情</a>
              <a @click="deleteSub(record)" style="color: #ff4d4f">删除</a>
            </a-space>
          </template>
        </template>
      </TableSearch>
    </div>
  </PageContainer>
</template>

<script setup>
import { getCurrentInstance, ref, onMounted } from 'vue';
import CommonTitleAction from '@/components/CommonTitleAction/index.vue';
import TableSearch from '@/components/TableSearch/index.vue';
import { expertPage, expertDelete } from '@/api/operator/expert';
import { getIndustryTypeDict } from '@/api/common';
import { useRouter } from 'vue-router';

const { proxy } = getCurrentInstance();
const router = useRouter();

const formItems = ref([
  {
    type: 'text',
    label: '专家名称',
    value: 'name',
  },
  {
    type: 'text',
    label: '联系电话',
    value: 'phone',
  },
  {
    type: 'select',
    label: '专业',
    value: 'major',
    options: [],
  },
  {
    type: 'datepicker',
    label: '创建时间',
    value: 'createTime',
  },
]);

const formData = {
  name: undefined,
  phone: undefined,
  major: undefined,
  createTime: undefined,
};

const columns = [
  {
    title: '专家编号',
    dataIndex: 'id',
    width: 200,
  },
  {
    title: '专家姓名',
    dataIndex: 'name',
    ellipsis: true,
    width: 180,
  },
  {
    title: '身份证号码',
    dataIndex: 'personId',
    width: 300,
    ellipsis: true,
  },
  {
    title: '专业',
    dataIndex: 'major',
    width: 120,
    ellipsis: true,
  },
  {
    title: '联系电话',
    dataIndex: 'phone',
    width: 160,
    ellipsis: true,
  },
  {
    title: '职称',
    dataIndex: 'professionalTitle',
    width: 180,
    ellipsis: true,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 200,
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    width: 120,
  },
];

const showDetail = (record) => {
  if (record) {
    router.push({ path: `/purchasingBidding/expert-list/${record.id}` });
  } else {
    router.push({ path: '/purchasingBidding/expert-list/add' });
  }
};

const deleteSub = (record) => {
  proxy.$confirm({
    title: `确定删除-${record.name}?`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      expertDelete(record.id).then(() => {
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

<style lang="less" scoped></style>
