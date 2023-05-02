<template>
  <PageContainer>
    <CommonTitleAction title="招标详情">
      <template #right>
        <a-button @click="showQuestions" type="primary">澄清答疑</a-button>
      </template>
    </CommonTitleAction>
    <div class="bg-main">
      <a-skeleton active :loading="loading">
        <CommonSubTitle title="招标进度" />
        <ProcessStep :status="formData.status" :data="formData.times" />
        <CommonSubTitle title="招标进度" />
        <CommonForm
          ref="infoForm"
          :formItems="formItems.info"
          :formData="formData.info"
          :canDisabled="true"
        />
        <template v-if="formData.status > 0">
          <CommonSubTitle title="投标应答" />
          <ProcessSupplier1 :data="dataSource.suppliers3" />
        </template>
        <template v-if="formData.status > 2">
          <CommonSubTitle title="开标记录" />
          <ProcessSupplier2 :data="dataSource.suppliers3" />
        </template>
        <template v-if="formData.status > 3">
          <CommonSubTitle title="评标情况" />
          <ProcessSupplier3 :data="dataSource.experts" />
        </template>
        <template v-if="formData.status > 4">
          <CommonSubTitle title="评标汇总" />
          <ProcessSupplier4
            :data="dataSource.suppliers3"
            :showOperate="formData.status === 5"
            @finish="getDetail"
          />
        </template>
        <template v-if="formData.status > 5">
          <CommonSubTitle title="定标情况" />
          <ProcessSupplier5 :data="dataSource.suppliers4" @finish="getDetail" />
        </template>
        <QuestionListModal ref="questionListModal" :bid-id="id" />
      </a-skeleton>
    </div>
  </PageContainer>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance, reactive } from 'vue';
import CommonTitleAction from '@/components/CommonTitleAction/index.vue';
import CommonForm from '@/components/CommonForm/index.vue';
import CommonSubTitle from '@/components/CommonSubTitle/index.vue';

import { bidDetail } from '@/api/operator/bid';
import ProcessStep from './components/ProcessStep.vue';
import ProcessSupplier1 from './components/ProcessSupplier1.vue';
import ProcessSupplier2 from './components/ProcessSupplier2.vue';
import ProcessSupplier3 from './components/ProcessSupplier3.vue';
import ProcessSupplier4 from './components/ProcessSupplier4.vue';
import ProcessSupplier5 from './components/ProcessSupplier5.vue';
import QuestionListModal from './components/QuestionListModal.vue';

const loading = ref(false);
const { proxy } = getCurrentInstance();
const props = defineProps({
  id: String,
});

// 表单配置
const formItems = reactive({
  info: [
    {
      type: 'text',
      label: '招标单号',
      value: 'id',
      rules: true,
    },
    {
      type: 'text',
      label: '招标预算',
      value: 'budgetAmount',
      rules: true,
    },
    {
      type: 'text',
      label: '报价类型',
      value: 'type',
      rules: true,
    },
    {
      type: 'text',
      label: '当前状态',
      value: 'status',
      rules: true,
    },
  ],
});

const dataSource = reactive({
  experts: [], // 专家列表
  suppliers3: [],
  suppliers4: [],
});

const formData = reactive({
  info: { id: '', budgetAmount: '', status: '', type: '' },
  status: 0,
  times: [],
});

onMounted(() => {
  // 获取详情
  props.id && getDetail(props.id);
});

const getDetail = () => {
  loading.value = true;
  bidDetail(props.id)
    .then((res) => {
      formData.status = res.status;
      formData.times = [
        res.createTime,
        res.startTime,
        res.endTime,
        res.bidOpenTime,
        `开始：${res.bidGradeTime ?? '-'}\n结束：${res.bidGradeEndTime ?? '-'}`,
        res.calibrateTime,
        res.noticeTime,
      ];
      const statusNames = ['建标', '投标中', '投标截止', '开标', '评标中', '定标', '中标通知'];
      formData.info = {
        id: res.id,
        budgetAmount: res.budgetAmount,
        status: statusNames[res.status],
        type: res.bidRuleisSealQuote ? '密封报价' : '公开报价',
      };

      dataSource.experts = res.bidExpertList.map((item) => ({
        name: item.expert.name,
        beginTime: item.beginTime,
        endTime: item.endTime,
        report: setupFile(item, 'reportUrlListJson'),
        attachment: setupFile(item, 'attachmentUrlListJson'),
        scoreList: item.scoreList,
      }));

      // dataSource.suppliers3 =
      //   res.bidRule.type === 0 ? res.bidInviteSupplierList : res.bidSupplierList;
      dataSource.suppliers3 = res.bidSupplierList;
      dataSource.suppliers4 = res.winBidSupplierList;
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
        uid: new Date().getTime(),
        name: item[key].split('/').pop(),
      },
    ];
  }
  return [];
};

const showQuestions = () => {
  proxy.$refs.questionListModal.show();
};
</script>

<style lang="less" scoped></style>
