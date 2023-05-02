<template>
  <PageContainer>
    <a-card :bordered="false">
      <CommonForm
        ref="form"
        formRef="testForm"
        :rules="rules"
        :formItems="formItems"
        :formData="formData"
      />
      <a-space>
        <a-button :loading="loading" @click="onFinish">确定</a-button>
      </a-space>
    </a-card>
  </PageContainer>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue';
import CommonForm from '@/components/CommonForm/index.vue';

const loading = ref(false);
const { proxy } = getCurrentInstance();

// 表单配置
const rules = {
  title: [{ required: true, message: '请输入' }],
  subTitle: [{ required: true, message: '请输入' }],
  sort: [{ required: true, message: '请输入' }],
  headImgUrl: [{ required: true, message: '请上传', trigger: 'change' }],
  status: [{ required: true, message: '请选择' }],
};

const formItems = [
  {
    type: 'text',
    label: '标题',
    value: 'title',
  },
  {
    type: 'text',
    label: '中标题',
    value: 'midTitle',
  },
  {
    type: 'text',
    label: '小标题',
    value: 'subTitle',
  },
  {
    type: 'number',
    label: '排序值',
    value: 'sort',
  },
  {
    type: 'select',
    label: '类型',
    value: 'status',
    placeholder: '请请选择',
    options: [
      { label: 'test', value: '1' },
      { label: '哈哈', value: '2' },
    ],
    width: 24,
  },
  {
    type: 'datepicker',
    label: '时间',
    value: 'time1',
  },
  {
    type: 'rangedatepicker',
    label: '日期',
    value: 'time2',
    showTime: true,
    format: 'YYYY-MM-DD HH:mm:ss',
    // placeholder: ['1', '2'],
  },
];
const formData = {
  title: '',
  midTitle: '',
  subTitle: '',
  sort: '',
  headImgUrl: undefined,
  status: '2',
  time1: undefined,
  time2: undefined,
};

const onFinish = (e) => {
  //   console.log(e);
  proxy.$refs.form
    .validateFields()
    .then((res) => {
      console.log(res);
    })
    .catch((res) => {
      console.log(res);
    });
};
</script>

<style lang="less" scoped></style>
