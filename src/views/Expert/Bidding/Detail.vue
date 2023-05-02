<template>
  <PageContainer>
    <CommonTitleAction :title="pageState.title">
      <template #right v-if="pageState.buttonTitle">
        <a-button :loading="submitLoading" @click="onFinish" type="primary">{{
          pageState.buttonTitle
        }}</a-button>
      </template>
    </CommonTitleAction>
    <div class="bg-main">
      <a-skeleton active :loading="loading">
        <CommonSubTitle title="基本信息" />
        <CommonForm :formItems="formItems[0]" :formData="formData[0]" :canDisabled="true" />
        <CommonSubTitle title="招标执行人" />
        <CommonForm :formItems="formItems[1]" :formData="formData[1]" :canDisabled="true" />
        <CommonSubTitle title="招标规则" />
        <CommonForm :formItems="formItems[2]" :formData="formData[2]" :canDisabled="true" />
        <CommonSubTitle title="招标文件" />
        <CommonForm :formItems="formItems[3]" :formData="formData[3]" :canDisabled="true" />

        <CommonSubTitle title="商品明细" />
        <GoodsEdit :canDisabled="true" :data="dataSource.goods" />

        <CommonSubTitle title="评分要素" />
        <GradeEdit :canDisabled="true" :data="dataSource.grades" />

        <CommonSubTitle title="投标供应商" />
        <ProcessSupplier1 :data="dataSource.suppliers" />

        <template v-if="!(pageState.canDisabled && dataSource.status === 0)">
          <CommonSubTitle title="评分汇总表" />
          <ScoreEdit
            :canDisable="pageState.canDisabled"
            :templates="dataSource.templates"
            :data="dataSource.scoreList"
            ref="scoreEdit"
          />

          <CommonSubTitle title="评标文件" />
          <CommonForm
            ref="fileForm"
            :formItems="formItems[4]"
            :formData="formData[4]"
            :canDisabled="pageState.canDisabled"
          />
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

import { bidAdd, bidDetail } from '@/api/expert/bid';

import GoodsEdit from '../../Purchaser/Demand/components/GoodsEdit.vue';
import GradeEdit from '../../Purchaser/Bidding/components/GradeEdit.vue';
import ProcessSupplier1 from '../../Purchaser/Bidding/components/ProcessSupplier1.vue';
import ScoreEdit from './components/ScoreEdit.vue';

const loading = ref(false);
const { proxy } = getCurrentInstance();
const props = defineProps({
  id: String,
  type: String, // 1: 查看 2：评标
});

const pageState = reactive({
  title: '',
  buttonTitle: '',
  canDisabled: false,
});

const setupPage = () => {
  if (props.type) {
    pageState.title = ['', '评标单', '评标详情'][props.type];
    if (props.type === '2') {
      pageState.buttonTitle = '提交';
      pageState.canDisabled = false;
    } else {
      pageState.buttonTitle = '';
      pageState.canDisabled = true;
    }
  }
};

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
      label: '招标书标题',
      value: 'title',
      rules: true,
    },
    {
      type: 'text',
      label: '招标类别',
      value: 'categoryName',
      rules: true,
    },
    {
      type: 'number',
      label: '轮次',
      value: 'round',
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
      label: '采购组织',
      value: 'organization',
      rules: true,
    },
    {
      type: 'text',
      label: '采购员',
      value: 'purchaseMan',
      rules: true,
    },
    {
      type: 'text',
      label: '需求部门',
      value: 'demandDept',
      rules: true,
    },
    {
      type: 'text',
      label: '预算金额',
      value: 'budgetAmount',
      rules: true,
    },
    {
      type: 'text',
      label: '创建人部门',
      value: 'createDept',
      rules: true,
    },
    {
      type: 'text',
      label: '创建日期',
      value: 'createTime',
      rules: true,
    },
    {
      type: 'text',
      label: '创建人',
      value: 'createBy',
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
      label: '投标截止时间',
      value: 'endTime',
      rules: true,
    },
    {
      type: 'text',
      label: '来源单据',
      value: 'sourceType',
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
      type: 'text',
      label: '招标员',
      value: 'tendereeName',
      rules: true,
    },
    {
      type: 'text',
      label: '开标员',
      value: 'bidOpenName',
      rules: true,
    },
    {
      type: 'text',
      label: '定标员',
      value: 'calibrateUserName',
      rules: true,
    },
  ],
  [
    {
      type: 'select',
      label: '招标方式',
      value: 'type',
      options: [
        { label: '邀请', value: 0, key: 'typeSelect' },
        { label: '公开', value: 1, key: 'typeSelect' },
      ],
      rules: true,
    },
    {
      type: 'select',
      label: '密封报价',
      value: 'isSealQuote',
      options: [
        { label: '否', value: 0 },
        { label: '是', value: 1 },
      ],
      rules: true,
    },
    {
      type: 'select',
      label: '是否公开招标结果',
      value: 'isPublic',
      options: [
        { label: '否', value: 0 },
        { label: '是', value: 1 },
      ],
      rules: true,
    },
    {
      type: 'number',
      label: '最多供应商数量',
      value: 'maxSupplierNum',
      rules: true,
    },
    {
      type: 'number',
      label: '最少供应商数量',
      value: 'minSupplierNum',
      rules: true,
    },
    {
      type: 'number',
      label: '专家评分',
      value: 'expertGrade',
      rules: true,
    },
    {
      type: 'text',
      label: '标书规则',
      value: 'documentRule',
      rules: true,
    },
    {
      type: 'text',
      label: '评标步制',
      value: 'evaluationProcedure',
      rules: true,
    },
    {
      type: 'number',
      label: '商务租权重%',
      value: 'businessGroupWeight',
      rules: true,
    },
    {
      type: 'number',
      label: '技术组权重%',
      value: 'technicalGroupWeight',
      rules: true,
    },
    {
      type: 'select',
      label: '是否专家抽取',
      value: 'isExpertExtract',
      options: [
        { label: '否', value: 0 },
        { label: '是', value: 1 },
      ],
      rules: true,
    },
    {
      type: 'text',
      label: '议价规则',
      value: 'bargainRule',
      rules: true,
    },
    {
      type: 'text',
      label: '多轮报价规则',
      value: 'multiRoundQuateRule',
      rules: true,
    },
    {
      type: 'text',
      label: '结果审批',
      value: 'resultApproval',
      rules: true,
    },
    {
      type: 'select',
      label: '资格预审',
      value: 'isPrequalification',
      options: [
        { label: '否', value: 0, key: 'isPrequalification' },
        { label: '是', value: 1, key: 'isPrequalification' },
      ],
      rules: true,
    },
    {
      type: 'datepicker',
      label: '预审截止时间',
      value: 'qualifyEndTime',
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      showTime: true,
      rules: true,
    },
    {
      type: 'file',
      label: '资格预审文件',
      value: 'prequalificationUrlListJson',
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
      type: 'file',
      label: '评标报告',
      value: 'reportUrlListJson',
      rules: true,
    },
    {
      type: 'file',
      label: '评审文件',
      value: 'attachmentUrlListJson',
      rules: true,
    },
  ],
]);

const dataSource = reactive({
  status: null, // 该专家是否已评标 0-未评标 1-已评标
  goods: [], // 商品明细
  grades: [], // 评分要素
  suppliers: [], // 邀请招标供应商

  bidExpertId: undefined,
  templates: [], // 模板
  scoreList: [],
});

const formData = ref(new Array(formItems.value.length).fill([]));

onMounted(() => {
  setupPage();
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
  bidDetail(props.id)
    .then((res) => {
      formData.value.forEach((child) => {
        Object.keys(child).forEach((el) => {
          if (
            el === 'tendereeAttachmentUrlListJson' ||
            el === 'businessAttachmentUrlListJson' ||
            el === 'technologyAttachmentUrlListJson'
          ) {
            child[el] = setupFile(res, el);
          } else if (el === 'sourceType') {
            // 来源
            child[el] = ['需求招标', '立项招标', '手动创建'][res[el]];
          } else {
            child[el] = res[el] ?? undefined;
          }
        });
      });

      const { bidRule, bidItemList, bidGradeList, bidExpert } = res;
      Object.keys(formData.value[2]).forEach((el) => {
        if (el === 'prequalificationUrlListJson') {
          formData.value[2][el] = setupFile(bidRule ?? {}, el);
        } else {
          formData.value[2][el] = bidRule?.[el] ?? undefined;
        }
      });
      Object.keys(formData.value[4]).forEach((el) => {
        formData.value[4][el] = setupFile(bidExpert ?? {}, el);
      });

      // 不需要资格预审
      if (bidRule.isPrequalification === 0) {
        formItems.value[2].splice(15, 2);
      }

      dataSource.bidExpertId = bidExpert.id;
      dataSource.status = bidExpert.status;
      dataSource.goods = bidItemList.map((item) => ({
        ...item,
        attachmentUrlList: setupFile(item, 'attachmentUrlListJson'),
      }));

      // 模板
      // bidExpert.bidScoreTemplate = {
      //   id: '958381097190687514',
      //   name: '共构标',
      //   bidScoreTemplateItemList: [
      //     {
      //       id: '958398726148194644',
      //       scoreTemplateId: '958381097190687514',
      //       type: 1,
      //       indexGroupName: '明月近飞根',
      //       indexName: '原信民始车团',
      //       scoreCriteria: 'aliquip',
      //       maxScore: 37,
      //     },
      //     {
      //       id: '958722586127106555',
      //       scoreTemplateId: '958381097190687514',
      //       type: 1,
      //       indexGroupName: 'cyvubinofpdsf',
      //       indexName: '测试测试测试测试测试测试',
      //       scoreCriteria: 'aliq念佛i而你们佛牌么uip',
      //       maxScore: 100,
      //     },
      //     {
      //       id: '958723131722170731',
      //       scoreTemplateId: '958381097190687514',
      //       type: 1,
      //       indexGroupName: 'cyvubinofpdsf',
      //       indexName: 'i而我围殴日文破日颇为开发商的膜i四年',
      //       scoreCriteria: 'aliq念佛i而你们佛牌么uip',
      //       maxScore: 100,
      //     },
      //     {
      //       id: '958722586127106556',
      //       scoreTemplateId: '958381097190687514',
      //       type: 2,
      //       indexGroupName: 'cyvubinofpdsf',
      //       indexName: '测试测试测试测试测试测试',
      //       scoreCriteria: 'aliq念佛i而你们佛牌么uip',
      //       maxScore: 44,
      //     },
      //     {
      //       id: '958723131722170761',
      //       scoreTemplateId: '958381097190687514',
      //       type: 2,
      //       indexGroupName: 'cyvubinofpdsf',
      //       indexName: 'i而我围殴日文破日颇为开发商的膜i四年',
      //       scoreCriteria: 'aliq念佛i而你们佛牌么uip',
      //       maxScore: 66,
      //     },
      //   ],
      // };
      // bidExpert.scoreList = [
      //   {
      //     bidSupplierId: '966722812288958531',
      //     supplierId: '953655386425000312',
      //     remark: 'good啊',
      //     techScoreItemList: [
      //       {
      //         bidScoreTemplateItemId: '958398726148194644',
      //         score: 50,
      //       },
      //       {
      //         bidScoreTemplateItemId: '958722586127106555',
      //         score: 60,
      //       },
      //       {
      //         bidScoreTemplateItemId: '958723131722170731',
      //         score: 48,
      //       },
      //     ],
      //     businessScoreItemList: [
      //       {
      //         bidScoreTemplateItemId: '958722586127106556',
      //         score: 20,
      //       },
      //       {
      //         bidScoreTemplateItemId: '958723131722170761',
      //         score: 50,
      //       },
      //     ],
      //     techTotalScore: 158,
      //     businessTotalScore: 0,
      //     totalScore: 63.2,
      //     supplier: {
      //       name: '测试01',
      //     },
      //   },
      //   {
      //     bidSupplierId: '966722812288958532',
      //     supplierId: '953655386425000322',
      //     remark: 'vasdvasvdasdv',
      //     techScoreItemList: [
      //       {
      //         bidScoreTemplateItemId: '958398726148194644',
      //         score: 30,
      //       },
      //       {
      //         bidScoreTemplateItemId: '958722586127106555',
      //         score: 20,
      //       },
      //       {
      //         bidScoreTemplateItemId: '958723131722170731',
      //         score: 48,
      //       },
      //     ],
      //     businessScoreItemList: [
      //       {
      //         bidScoreTemplateItemId: '958722586127106556',
      //         score: 10,
      //       },
      //       {
      //         bidScoreTemplateItemId: '958723131722170761',
      //         score: 50,
      //       },
      //     ],
      //     techTotalScore: 158,
      //     businessTotalScore: 0,
      //     totalScore: 63.2,
      //     supplier: {
      //       name: '测试02',
      //     },
      //   },
      // ];
      // res.bidSupplierList = [
      //   {
      //     supplierId: '953655386425000312',
      //     supplierName: '测试01',
      //   },
      //   {
      //     supplierId: '953655386425000322',
      //     supplierName: '测试02',
      //   },
      // ];
      const templates = [];
      const template1 = bidExpert.bidScoreTemplate?.bidScoreTemplateItemList.filter(
        (item) => item.type === 1,
      );
      if (template1.length > 0) {
        templates.push({ key: '技术标', values: template1, type: 'techScoreItemList' });
      }
      const template2 = bidExpert.bidScoreTemplate?.bidScoreTemplateItemList.filter(
        (item) => item.type === 2,
      );
      if (template2.length > 0) {
        templates.push({ key: '商务标', values: template2, type: 'businessScoreItemList' });
      }
      dataSource.templates = templates;

      // 分值
      const scoreList = [];
      res.bidSupplierList?.forEach((item) => {
        const extendObj = { remark: '', techScoreItemList: {}, businessScoreItemList: {} };
        bidExpert.bidScoreTemplate?.bidScoreTemplateItemList.forEach((el) => {
          if (el.type === 1) {
            extendObj.techScoreItemList[el.id] = '';
          } else {
            extendObj.businessScoreItemList[el.id] = '';
          }
        });

        if (bidExpert.scoreList) {
          // 当前供应商分数信息
          const supplierScore = bidExpert.scoreList.find((el) => el.supplierId === item.supplierId);
          if (supplierScore === undefined) {
            return;
          }
          const { remark, techTotalScore, techScoreItemList, businessScoreItemList } =
            supplierScore;
          techScoreItemList?.forEach((el) => {
            extendObj.techScoreItemList[el.bidScoreTemplateItemId] = el.score;
          });
          businessScoreItemList?.forEach((el) => {
            extendObj.businessScoreItemList[el.bidScoreTemplateItemId] = el.score;
          });
          extendObj.remark = remark;
        }
        scoreList.push({ id: item.id, name: item.supplierName, ...extendObj });
      });

      dataSource.scoreList = scoreList;

      dataSource.grades = bidGradeList;
      // 是否邀请供应商招标
      dataSource.suppliers = res.bidSupplierList || [];
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

// 提交保存
const submitLoading = ref(false);
const onFinish = () => {
  const { fileForm, scoreEdit } = proxy.$refs;
  Promise.all([fileForm.validateFields(), scoreEdit.validate()]).then((result) => {
    const files = result[0];
    if (Array.isArray(files.reportUrlListJson)) {
      files.reportUrlListJson = files.reportUrlListJson[0].url;
    }
    if (Array.isArray(files.attachmentUrlListJson)) {
      files.attachmentUrlListJson = files.attachmentUrlListJson[0].url;
    }

    const scoreList = result[1];

    const params = {
      ...files,
      scoreList,
      bidExpertId: dataSource.bidExpertId,
    };
    console.log(params);

    submitLoading.value = true;
    bidAdd(params)
      .then(() => {
        proxy.$message.success('提交成功');
        proxy.$router.go(-1);
      })
      .finally(() => {
        submitLoading.value = false;
      });
  });
};
</script>

<style lang="less" scoped></style>
