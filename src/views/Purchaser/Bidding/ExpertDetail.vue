<template>
  <PageContainer>
    <CommonTitleAction :title="id ? '专家详情' : '专家添加'">
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
      </a-skeleton>
    </div>
  </PageContainer>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue';
import CommonTitleAction from '@/components/CommonTitleAction/index.vue';
import CommonForm from '@/components/CommonForm/index.vue';
import CommonSubTitle from '@/components/CommonSubTitle/index.vue';
import { expertDetail, expertAdd, expertEdit } from '@/api/operator/expert';
import { formRules } from '@/utils/rules';
import { getSexDict, getIndustryTypeDict, getDeptDict, getProfessionalDict } from '@/api/common';

const loading = ref(false);
const { proxy } = getCurrentInstance();
const props = defineProps({
  id: String,
});

// 表单配置
const formItems = ref([
  {
    type: 'text',
    label: '专家名称',
    value: 'name',
    rules: true,
  },
  {
    type: 'text',
    label: '身份证',
    value: 'personId',
    rules: formRules('idNo'),
  },
  {
    type: 'text',
    label: '联系电话',
    value: 'phone',
    rules: formRules('cellPhone'),
  },
  {
    type: 'select',
    label: '性别',
    value: 'sex',
    options: [],
    rules: true,
  },
  {
    type: 'text',
    label: '联系邮箱',
    value: 'email',
    rules: formRules('cellEmail'),
  },
  {
    type: 'select',
    label: '专业',
    value: 'major',
    options: [],
    rules: true,
  },
  {
    type: 'select',
    label: '所属单位',
    value: 'dept',
    options: [],
    rules: true,
  },
  {
    type: 'select',
    label: '职称',
    value: 'professionalTitle',
    options: [],
    rules: true,
  },
  {
    type: 'file',
    label: '职业资格',
    value: 'attachmentUrlListJson',
    rules: true,
  },
  {
    type: 'text',
    label: '账号密码',
    value: 'password',
    rules: true,
  },
]);

const formData = ref({});

onMounted(() => {
  // 组装默认的formData
  formItems.value.forEach((item) => {
    formData.value[item.value] = undefined;
  });

  getDict();
  if (props.id) {
    formItems.value.splice(9, 1);
    getDetail(props.id);
  }
});

const getDetail = () => {
  loading.value = true;
  expertDetail(props.id)
    .then((res) => {
      Object.keys(formData.value).forEach((key) => {
        if (key === 'attachmentUrlListJson') {
          formData.value[key] = [
            {
              status: 'done',
              url: res.attachmentUrlListJson,
              uid: new Date().getTime(),
              name: res.attachmentUrlListJson.split('/').pop(),
            },
          ];
        } else {
          formData.value[key] = res[key] || undefined;
        }
      });
    })
    .finally(() => {
      loading.value = false;
    });
};

// 获取字典内容
const getDict = () => {
  getSexDict().then((res) => {
    formItems.value[3].options = res.map((item) => ({
      label: item.dictKey,
      value: item.dictKey,
    }));
  });
  getIndustryTypeDict().then((res) => {
    formItems.value[5].options = res.map((item) => ({
      label: item.dictKey,
      value: item.dictKey,
    }));
  });
  getDeptDict().then((res) => {
    formItems.value[6].options = res.map((item) => ({
      label: item.dictKey,
      value: item.dictKey,
    }));
  });
  getProfessionalDict().then((res) => {
    formItems.value[7].options = res.map((item) => ({
      label: item.dictKey,
      value: item.dictKey,
    }));
  });
};

// 提交保存
const submitLoading = ref(false);
const onFinish = () => {
  const { infoForm } = proxy.$refs;
  infoForm.validateFields().then((values) => {
    const params = { ...values, id: props.id };
    if (Array.isArray(params.attachmentUrlListJson)) {
      params.attachmentUrlListJson = params.attachmentUrlListJson[0].url;
    }
    console.log(params);

    const api = props.id ? expertEdit : expertAdd;
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
