<template>
  <PageContainer>
    <CommonTitleAction :title="id ? '机构编辑' : '机构添加'">
      <template #right>
        <a-button :loading="submitLoading" @click="onFinish" type="primary">{{
          id ? '保存' : '提交'
        }}</a-button>
      </template>
    </CommonTitleAction>
    <div class="bg-main">
      <a-skeleton active :loading="loading">
        <CommonSubTitle title="基本信息" />
        <CommonForm ref="infoForm" :formItems="formItems" :formData="formData" />
        <template v-if="id">
          <CommonSubTitle title="员工信息">
            <template #right>
              <a-button @click="handleAdd" type="primary" size="small">添加</a-button>
            </template>
          </CommonSubTitle>
          <div style="padding: 0 16px 20px">
            <CommonTable
              ref="tableRef"
              :columns="columns"
              :api="userPage"
              :params="{ agentId: id }"
            >
              <template #cell="{ column, record, index, text }">
                <template v-if="column.key === 'action'">
                  <a v-if="record.isLeader !== 1" @click="deleteSub(record)" style="color: #ff4d4f"
                    >删除</a
                  >
                </template>
              </template>
            </CommonTable>
            <UserModal ref="userModal" @finish="refreshTable" />
          </div>
        </template>
      </a-skeleton>
    </div>
  </PageContainer>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue';
import CommonTitleAction from '@/components/CommonTitleAction/index.vue';
import CommonForm from '@/components/CommonForm/index.vue';
import CommonSubTitle from '@/components/CommonSubTitle/index.vue';
import CommonTable from '@/components/CommonTable/index.vue';
import { agentDetail, agentAdd, agentEdit, userPage, userDelete } from '@/api/operator/agent.js';
import { formRules } from '@/utils/rules';
import UserModal from './components/UserModal.vue';

const loading = ref(false);
const { proxy } = getCurrentInstance();
const props = defineProps({
  id: String,
});

// 表单配置
const formItems = ref([
  {
    type: 'text',
    label: '代理机构名称',
    value: 'name',
    rules: true,
  },
  {
    type: 'text',
    label: '统一社会信用代码',
    value: 'uniformCreditCode',
    rules: true,
  },
  {
    type: 'text',
    label: '负责人',
    value: 'linkman',
    rules: true,
  },
  {
    type: 'text',
    label: '注册资本',
    value: 'registerFund',
    rules: true,
  },
  {
    type: 'text',
    label: '联系电话',
    value: 'linkmanPhone',
    rules: formRules('cellPhone'),
  },
  {
    type: 'text',
    label: '联系邮箱',
    value: 'linkmanEmail',
    rules: formRules('cellEmail'),
  },
  {
    type: 'text',
    label: '详细地址',
    value: 'linkmanAddress',
    rules: true,
  },
]);

const formData = ref({});

onMounted(() => {
  // 组装默认的formData
  formItems.value.forEach((item) => {
    formData.value[item.value] = undefined;
  });

  // 获取详情
  props.id && getDetail(props.id);
});

const getDetail = () => {
  loading.value = true;
  agentDetail(props.id)
    .then((res) => {
      Object.keys(formData.value).forEach((key) => {
        formData.value[key] = res[key] || undefined;
      });
    })
    .finally(() => {
      loading.value = false;
    });
};

// 提交保存
const submitLoading = ref(false);
const onFinish = () => {
  const { infoForm } = proxy.$refs;
  infoForm.validateFields().then((values) => {
    const params = { ...values, id: props.id };
    console.log(params);

    const api = props.id ? agentEdit : agentAdd;
    const message = props.id ? '保存成功' : '提交成功';
    submitLoading.value = true;
    api(params)
      .then(() => {
        proxy.$message.success(message);
        proxy.$router.go(-1);
      })
      .finally(() => {
        submitLoading.value = false;
      });
  });
};

// 员工逻辑
const columns = [
  {
    title: '序号',
    customRender: ({ index }) => `${index + 1}`,
  },
  {
    title: '姓名',
    dataIndex: 'name',
  },
  {
    title: '手机号',
    dataIndex: 'phone',
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
const handleAdd = () => {
  proxy.$refs.userModal.show({ title: '添加', agentId: props.id });
};

const deleteSub = (record) => {
  proxy.$confirm({
    title: `确定删除-${record.name}?`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      userDelete(record.id).then(() => {
        proxy.$message.success('删除成功');
        proxy.$refs.tableRef.tableSearch();
      });
    },
  });
};

const refreshTable = () => {
  proxy.$refs.tableRef.tableSearch();
};
</script>

<style lang="less" scoped></style>
