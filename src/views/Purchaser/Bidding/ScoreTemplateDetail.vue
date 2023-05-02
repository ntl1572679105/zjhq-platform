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
            :formItems="formItems"
            :formData="formData"
          />

          <CommonSubTitle title="技术标" />
          <ScoreTemplateEdit
            :type="1"
            :canDisabled="pageState.canDisabled"
            :data="dataSource.list1"
            ref="scoreTemplateEdit1"
          />
          <CommonSubTitle title="商务标" />
          <ScoreTemplateEdit
            :type="2"
            :canDisabled="pageState.canDisabled"
            :data="dataSource.list2"
            ref="scoreTemplateEdit2"
          />
        </div>
      </a-skeleton>
    </div>
  </PageContainer>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance, reactive } from 'vue';
import CommonTitleAction from '@/components/CommonTitleAction/index.vue';
import CommonForm from '@/components/CommonForm/index.vue';
import CommonSubTitle from '@/components/CommonSubTitle/index.vue';
import ScoreTemplateEdit from './components/ScoreTemplateEdit.vue';
import { scoreTemplateAdd, scoreTemplateEdit, scoreTemplateDetail } from '@/api/operator/bid';

const loading = ref(false);
const { proxy } = getCurrentInstance();
const props = defineProps({
  id: String,
  type: String, // 1:查看 2:编辑
});

// 标题及按钮
const pageState = reactive({
  title: '',
  buttonTitle: '',
  canDisabled: false,
});

const setupPage = () => {
  if (props.type) {
    pageState.title = ['', '模板详情', '编辑模板'][props.type];
    if (props.type === '2') {
      pageState.buttonTitle = '保存';
      pageState.canDisabled = false;
    } else {
      pageState.buttonTitle = '';
      pageState.canDisabled = true;
    }
  } else {
    pageState.title = '新建模板';
    pageState.buttonTitle = '提交';
  }
};

// 表单配置
const formItems = ref([
  {
    type: 'text',
    label: '模板名称',
    value: 'name',
    rules: true,
  },
  {
    type: 'select',
    label: '模板状态',
    value: 'status',
    rules: true,
    options: [
      { label: '未启用', value: 0 },
      { label: '启用', value: 1 },
    ],
  },
]);

const dataSource = reactive({
  list1: [],
  list2: [],
});

const formData = ref({});

onMounted(() => {
  setupPage();
  // 组装默认的formData
  formItems.value.forEach((child) => {
    formData.value[child.value] = undefined;
  });

  props.id && getDetail(props.id);
});

const getDetail = () => {
  loading.value = true;
  scoreTemplateDetail(props.id)
    .then((res) => {
      Object.keys(formData.value).forEach((el) => {
        formData.value[el] = res[el] ?? undefined;
      });
      dataSource.list1 = res.bidScoreTemplateItemList.filter((item) => item.type === 1);
      dataSource.list2 = res.bidScoreTemplateItemList.filter((item) => item.type === 2);
    })
    .finally(() => {
      loading.value = false;
    });
};

// 提交保存
const submitLoading = ref(false);
const onFinish = () => {
  const { infoForm, scoreTemplateEdit1, scoreTemplateEdit2 } = proxy.$refs;
  Promise.all([
    infoForm.validateFields(),
    scoreTemplateEdit1.validate(),
    scoreTemplateEdit2.validate(),
  ]).then((result) => {
    const info = result[0];
    const bidScoreTemplateItemParamList = [...result[1], ...result[2]];

    const params = { ...info, bidScoreTemplateItemParamList, id: props.id };
    console.log(params);
    const api = props.id ? scoreTemplateEdit : scoreTemplateAdd;
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
