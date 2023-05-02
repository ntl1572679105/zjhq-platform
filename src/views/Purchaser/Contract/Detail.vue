<template>
  <PageContainer>
    <CommonTitleAction :title="pageState.title">
      <template #right v-if="pageState.buttonTitle">
        <a-button :loading="submitLoading" @click="onFinish" type="primary">{{
          pageState.buttonTitle
        }}</a-button>
      </template>
    </CommonTitleAction>
    <div class="bg-main flex">
      <a-skeleton active :loading="loading">
        <div style="width: 100%; overflow: hidden">
          <CommonSubTitle title="基本信息" />
          <CommonForm
            :canDisabled="pageState.canDisabled"
            ref="infoForm"
            :formItems="formItems[0]"
            :formData="formData[0]"
          />

          <CommonSubTitle title="合同附件" />
          <CommonForm
            :canDisabled="pageState.canDisabled"
            ref="fileForm"
            :formItems="formItems[1]"
            :formData="formData[1]"
          />
        </div>
        <FlowContainer
          v-if="approval.businessKey && pageState.canDisabled"
          :businessKey="approval.businessKey"
          :api="contractApproval"
          :params="{ id: id }"
          :name="type === '0' ? '合同审核' : '廉政合约审核'"
        />
      </a-skeleton>
    </div>
  </PageContainer>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance, reactive } from 'vue';
import CommonTitleAction from '@/components/CommonTitleAction/index.vue';
import CommonForm from '@/components/CommonForm/index.vue';
import CommonSubTitle from '@/components/CommonSubTitle/index.vue';
import {
  contractAdd,
  contractApproval,
  contractDetail,
  integrityContractDetail,
  contractEdit,
} from '@/api/operator/contract';
import FlowContainer from '@/components/Flow/index.vue';

const loading = ref(false);
const { proxy } = getCurrentInstance();
const props = defineProps({
  id: String,
  number: String, // 1:查看 2:编辑 3:审批
  type: String, // 类型 0-合同，1-廉政合约
});

// 标题及按钮
const pageState = reactive({
  title: '',
  buttonTitle: '',
  canDisabled: false,
});

const setupPage = () => {
  if (props.number) {
    pageState.title = ['', '合同详情', '合同需求', '合同审批'][props.number];
    if (props.number === '2') {
      pageState.buttonTitle = '保存';
      pageState.canDisabled = false;
    } else {
      pageState.buttonTitle = '';
      pageState.canDisabled = true;
    }
  } else {
    pageState.title = '上传合同';
    pageState.buttonTitle = '提交';
  }
};

// 表单配置
const formItems = ref([
  [
    {
      type: 'text',
      label: '合同名称',
      value: 'name',
      rules: true,
    },
    {
      type: 'text',
      label: '企业名称',
      value: 'enterprise',
      rules: true,
    },
    {
      type: 'text',
      label: '负责人',
      value: 'person',
      rules: true,
    },
    {
      type: 'datepicker',
      label: '签订日期',
      value: 'signTime',
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      rules: true,
    },
    {
      type: 'datepicker',
      label: '开始日期',
      value: 'startTime',
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      rules: true,
    },
    {
      type: 'datepicker',
      label: '结束日期',
      value: 'endTime',
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      rules: true,
    },
    {
      type: 'number',
      label: '合同总金额',
      value: 'totalAmount',
      rules: true,
    },
    {
      type: 'textarea',
      label: '备注',
      value: 'remark',
      rules: true,
    },
  ],
  [
    {
      type: 'file',
      label: '合同附件',
      value: 'documentUrl',
      rules: true,
    },
    {
      type: 'file',
      label: '合同相关图片',
      value: 'imgUrl',
      rules: true,
    },
  ],
]);

const formData = ref(new Array(formItems.value.length).fill([]));

onMounted(() => {
  setupPage();
  // 组装默认的formData
  const tempList = [];
  formItems.value.forEach((child) => {
    const el = {};
    child.forEach((item) => {
      el[item.value] = undefined;
    });
    tempList.push(el);
  });
  formData.value = tempList;

  props.id && getDetail(props.id);
});

const getDetail = () => {
  loading.value = true;
  const api = props.type === '0' ? contractDetail : integrityContractDetail;
  api(props.id)
    .then((res) => {
      formData.value.forEach((child) => {
        Object.keys(child).forEach((el) => {
          if (el === 'documentUrl' || el === 'imgUrl') {
            child[el] = setupFile(res, el);
          } else {
            child[el] = res[el] ?? undefined;
          }
        });
      });

      approval.businessKey = res.businessKey;
    })
    .finally(() => {
      loading.value = false;
    });
};

const setupFile = (item, key) => {
  if (item[key]) {
    return [
      {
        status: 'done',
        url: item[key],
        uid: Math.random().toString(),
        name: item[key]?.split('/').pop() ?? '',
      },
    ];
  }
  return [];
};

/// 审批
const approval = reactive({
  businessKey: '',
});

// 提交保存
const submitLoading = ref(false);
const onFinish = () => {
  const { infoForm, fileForm } = proxy.$refs;
  Promise.all([infoForm.validateFields(), fileForm.validateFields()]).then((result) => {
    const info = result[0];
    const files = result[1];
    if (Array.isArray(files.documentUrl)) {
      files.documentUrl = files.documentUrl[0].url;
    }
    if (Array.isArray(files.imgUrl)) {
      files.imgUrl = files.imgUrl[0].url;
    }

    const params = { ...info, ...files, id: props.id, type: props.type };
    console.log(params);
    const api = props.id ? contractEdit : contractAdd;
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
</script>

<style lang="less" scoped></style>
