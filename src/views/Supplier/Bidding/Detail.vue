<template>
  <PageContainer>
    <CommonTitleAction title="项目详情" />

    <div class="bg-main">
      <a-skeleton active :loading="loading">
        <CommonSubTitle title="招标进度" />
        <ProcessStep :status="dataSource.status" :data="dataSource.times" />
        <CommonSubTitle title="基本信息" />
        <CommonForm :formItems="formItems[0]" :formData="formData[0]" :canDisabled="true" />
        <CommonSubTitle title="招标文件" />
        <CommonForm :formItems="formItems[1]" :formData="formData[1]" :canDisabled="true" />

        <template v-if="dataSource.status > 1">
          <CommonSubTitle title="投标基本信息" />
          <CommonForm :formItems="formItems[2]" :formData="formData[2]" :canDisabled="true" />
          <CommonSubTitle title="投标文件" />
          <CommonForm :formItems="formItems[3]" :formData="formData[3]" :canDisabled="true" />
        </template>

        <CommonSubTitle title="商品明细" />
        <GoodsEdit :canDisabled="true" :data="dataSource.goods" />

        <CommonSubTitle title="提议记录" />
        <QuestionList :data="dataSource.questionList" />

        <template v-if="dataSource.status === 6">
          <CommonSubTitle title="中标情况" />
          <FinishView :data="dataSource.result" />
        </template>
      </a-skeleton>
    </div>
  </PageContainer>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance, reactive } from 'vue';
import CommonTitleAction from '@/components/CommonTitleAction/index.vue';
import CommonForm from '@/components/CommonForm/index.vue';
import CommonSubTitle from '@/components/CommonSubTitle/index.vue';

import { bidDtail } from '@/api/supplier/bid';
import ProcessStep from '../../Purchaser/Bidding/components/ProcessStep.vue';
import GoodsEdit from './components/GoodsEdit.vue';
import QuestionList from './components/QuestionList.vue';
import FinishView from './components/FinishView.vue';

const loading = ref(false);
const { proxy } = getCurrentInstance();
const props = defineProps({
  id: String,
});

// 表单配置
const formItems = ref([
  [
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
      label: '投标开始时间',
      value: 'startTime',
      rules: true,
    },
    {
      type: 'text',
      label: '投标结束时间',
      value: 'endTime',
      rules: true,
    },
    {
      type: 'text',
      label: '开标时间',
      value: 'bidOpenTime',
      rules: true,
    },
  ],
  [
    {
      type: 'file',
      label: '招标文件',
      value: 'tendereeAttachmentUrlListJson',
      rules: true,
    },
    {
      type: 'file',
      label: '商务附件',
      value: 'businessAttachmentUrlListJson',
      rules: true,
    },
    {
      type: 'file',
      label: '技术附件',
      value: 'technologyAttachmentUrlListJson',
      rules: true,
    },
  ],
  [
    {
      type: 'text',
      label: '投标单号',
      value: 'bidId',
      rules: true,
    },
    {
      type: 'text',
      label: '投标单标题',
      value: 'title',
      rules: true,
    },
    {
      type: 'text',
      label: '联系人',
      value: 'linkman',
      rules: true,
    },
    {
      type: 'text',
      label: '联系方式',
      value: 'linkmanPhone',
      rules: true,
    },
    {
      type: 'text',
      label: '报价总金额',
      value: 'quoteAmount',
      rules: true,
    },
    {
      type: 'text',
      label: '备注',
      value: 'remark',
      rules: true,
    },
  ],
  [
    {
      type: 'file',
      label: '投标文件',
      value: 'tenderAttachmentUrlListJson',
      rules: true,
    },
    {
      type: 'file',
      label: '商务附件',
      value: 'businessAttachmentUrlListJson',
      rules: true,
    },
    {
      type: 'file',
      label: '技术附件',
      value: 'technologyAttachmentUrlListJson',
      rules: true,
    },
  ],
]);

const dataSource = reactive({
  status: 0,
  times: [],
  goods: [],
  questionList: [],
  result: [],
});

const formData = ref(new Array(formItems.value.length).fill([]));

onMounted(() => {
  const tempList = [];
  formItems.value.forEach((child) => {
    const el = {};
    child.forEach((item) => {
      el[item.value] = undefined;
    });
    tempList.push(el);
  });
  formData.value = tempList;

  // 获取详情
  props.id && getDetail(props.id);
});

const getDetail = () => {
  loading.value = true;
  bidDtail(props.id)
    .then((res) => {
      formData.value.forEach((child) => {
        Object.keys(child).forEach((el) => {
          if (
            el === 'tendereeAttachmentUrlListJson' ||
            el === 'businessAttachmentUrlListJson' ||
            el === 'technologyAttachmentUrlListJson'
          ) {
            // 营业执照
            child[el] = setupFile(res, el);
          } else {
            child[el] = res[el] ?? undefined;
          }
        });
      });

      const { bidSupplier } = res;
      Object.keys(formData.value[2]).forEach((el) => {
        formData.value[2][el] = bidSupplier?.[el] ?? undefined;
      });
      Object.keys(formData.value[3]).forEach((el) => {
        formData.value[3][el] = setupFile(bidSupplier ?? {}, el);
      });

      dataSource.status = res.status;
      dataSource.times = [
        res.createTime,
        res.startTime,
        res.endTime,
        res.bidOpenTime,
        `开始：${res.bidGradeTime ?? '-'}\n结束：${res.bidGradeEndTime ?? '-'}`,
        res.calibrateTime,
        res.noticeTime,
      ];

      dataSource.goods = bidSupplier?.bidSupplierItemList || [];
      dataSource.questionList = res.bidQuestionList;
      if (bidSupplier) {
        const { winStatus, winNotificationUrl, winRemark } = bidSupplier;
        dataSource.result = [{ winStatus, winNotificationUrl, winRemark }];
      }
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
</script>

<style lang="less" scoped></style>
