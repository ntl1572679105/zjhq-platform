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
            ref="infoForm"
            :formItems="formItems[0]"
            :formData="formData[0]"
            :canDisabled="pageState.canDisabled"
            @selectChange="selectChange"
          />
          <CommonSubTitle title="招标执行人" />
          <CommonForm
            ref="userForm"
            :formItems="formItems[1]"
            :formData="formData[1]"
            :canDisabled="pageState.canDisabled"
          />
          <CommonSubTitle title="招标规则" />
          <CommonForm
            ref="ruleForm"
            :formItems="formItems[2]"
            :formData="formData[2]"
            @selectChange="selectChange"
            :canDisabled="pageState.canDisabled"
          />
          <CommonSubTitle title="招标文件" />
          <CommonForm
            ref="fileForm"
            :formItems="formItems[3]"
            :formData="formData[3]"
            :canDisabled="pageState.canDisabled"
          />

          <template v-if="dataSource.categoryId">
            <CommonSubTitle title="商品明细" />
            <GoodsEdit
              ref="goodsEdit"
              :canDisabled="pageState.canDisabled"
              :categoryId="dataSource.categoryId"
              :data="dataSource.goods"
            />
          </template>

          <template v-if="dataSource.bidType === 0">
            <CommonSubTitle title="供应商" />
            <SupplierEdit
              :canDisabled="pageState.canDisabled"
              :data="dataSource.suppliers"
              ref="supplierEdit"
            />
          </template>

          <CommonSubTitle title="专家" />
          <ExpertEdit
            :canDisabled="pageState.canDisabled"
            :data="dataSource.experts"
            ref="expertEdit"
          />
          <CommonSubTitle title="评分要素" />
          <GradeEdit
            :canDisabled="pageState.canDisabled"
            :data="dataSource.grades"
            ref="gradeEdit"
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

import { bidAdd, bidDetail, bidEdit } from '@/api/operator/bid';
import { categoryAll } from '@/api/common';
import { userList } from '@/api/erp/common';
import { deptTree } from '@/api/erp/dept.js';

import GoodsEdit from '../Demand/components/GoodsEdit.vue';
import ExpertEdit from './components/ExpertEdit.vue';
import GradeEdit from './components/GradeEdit.vue';
import SupplierEdit from './components/SupplierEdit.vue';

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
    pageState.title = ['', '招标详情', '编辑招标'][props.type];
    if (props.type === '2') {
      pageState.buttonTitle = '保存';
      pageState.canDisabled = false;
    } else {
      pageState.buttonTitle = '';
      pageState.canDisabled = true;
    }
  } else {
    pageState.title = '新建招标';
    pageState.buttonTitle = '提交';
  }
};

// 表单配置
const formItems = ref([
  [
    {
      type: 'text',
      label: '招标书标题',
      value: 'title',
      rules: true,
    },
    {
      type: 'select',
      label: '招标类别',
      value: 'categoryId',
      options: [],
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
      type: 'cascader',
      label: '需求部门',
      value: 'demandDeptId',
      options: [],
      rules: true,
      changeOnSelect: true,
    },
    {
      type: 'datepicker',
      label: '投标开始时间',
      value: 'startTime',
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      showTime: true,
      rules: true,
    },
    {
      type: 'datepicker',
      label: '投标截止时间',
      value: 'endTime',
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      showTime: true,
      rules: true,
    },
    {
      type: 'datepicker',
      label: '开标时间',
      value: 'bidOpenTime',
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      showTime: true,
      rules: true,
    },
    // {
    //   type: 'text',
    //   label: '来源单据',
    //   value: 'source',
    //   rules: true,
    // },
    {
      type: 'textarea',
      label: '备注',
      value: 'remark',
      rules: true,
    },
  ],
  [
    {
      type: 'select',
      label: '招标员',
      value: 'tendereeId',
      options: [],
      rules: true,
    },
    {
      type: 'select',
      label: '开标员',
      value: 'bidOpenUserId',
      options: [],
      rules: true,
    },
    {
      type: 'select',
      label: '定标员',
      value: 'calibrateUserId',
      options: [],
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
]);

const selectChange = ({ value, option }) => {
  if (option.key === 'isPrequalification') {
    if (value === 0 && formItems.value[2].length === 17) {
      formItems.value[2].splice(15, 2);
    } else if (value === 1 && formItems.value[2].length === 15) {
      formItems.value[2].splice(
        15,
        0,
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
      );
    }
    proxy.$refs.ruleForm.resetRules();
  } else if (option.key === 'typeSelect') {
    dataSource.bidType = value;
  } else if (option.key === 'categoryAll') {
    dataSource.categoryId = value;
  }
};

const dataSource = reactive({
  goods: [], // 商品明细
  experts: [], // 专家列表
  grades: [], // 评分要素
  suppliers: [], // 邀请招标供应商

  categoryId: undefined, // 招标类别
  bidType: undefined, // 招标方式
});

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
  getDict();
});

const getDetail = () => {
  bidDetail(props.id)
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
          } else if (el === 'demandDeptId') {
            child[el] = getDeptIds(res[el]);
          } else {
            child[el] = res[el] ?? undefined;
          }
        });
      });

      const { bidRule, bidItemList, bidExpertList, bidGradeList, bidInviteSupplierList } = res;
      Object.keys(formData.value[2]).forEach((el) => {
        if (el === 'prequalificationUrlListJson') {
          formData.value[2][el] = setupFile(bidRule ?? {}, el);
        } else {
          formData.value[2][el] = bidRule?.[el] ?? undefined;
        }
      });
      // 不需要资格预审
      if (bidRule && bidRule.isPrequalification === 0) {
        formItems.value[2].splice(15, 2);
      }

      dataSource.goods = bidItemList.map((item) => ({
        ...item,
        attachmentUrlList: setupFile(item, 'attachmentUrlListJson'),
      }));
      dataSource.experts = bidExpertList.map((item) => ({
        ...item,
        phone: item.expert.phone,
        email: item.expert.email,
      }));
      dataSource.grades = bidGradeList;
      // 是否邀请供应商招标
      dataSource.bidType = bidRule?.type;
      dataSource.suppliers = bidInviteSupplierList || [];
      // 当前招标类别
      dataSource.categoryId = res.categoryId;
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

// 获取字典内容
const getDict = () => {
  loading.value = true;
  Promise.all([categoryAll(), userList(), deptTree()]).then((result) => {
    formItems.value[0][1].options = result[0].map((item) => ({
      label: item.name,
      value: item.id,
      key: 'categoryAll',
    }));

    const options = result[1].map((item) => ({ label: item.userName, value: item.id }));
    formItems.value[1][0].options = options;
    formItems.value[1][1].options = options;
    formItems.value[1][2].options = options;

    const list = result[2];
    const ob = {};
    dataClean(list, ob);
    formItems.value[0][6].options = list;
    deptState.ob = ob;

    if (props.id) {
      getDetail(props.id);
    } else {
      loading.value = false;
    }
  });
};

// 部门数据
const deptState = reactive({
  ob: null, // {id: item}, 用以根据id递归获取父部门
});

const dataClean = (list, ob) => {
  list.forEach((item) => {
    ob[item.id] = item;
    item.label = item.name;
    item.value = item.id;
    if (item.children) {
      if (item.children.length === 0) {
        delete item.children;
      } else {
        dataClean(item.children, ob);
      }
    }
  });
};

const getDeptIds = (id) => {
  if (!id || id === '0') {
    return [];
  } else {
    const getNextId = (curId, list) => {
      if (!curId || curId === '0') {
        // 根节点
        return;
      }
      list.push(curId);
      getNextId(deptState.ob[curId]?.parentId, list);
    };
    const ids = [];
    getNextId(id, ids);
    return ids.reverse();
  }
};

// 提交保存
const submitLoading = ref(false);
const onFinish = () => {
  const { infoForm, userForm, ruleForm, fileForm, goodsEdit, expertEdit, gradeEdit, supplierEdit } =
    proxy.$refs;
  Promise.all([
    infoForm.validateFields(),
    userForm.validateFields(),
    ruleForm.validateFields(),
    fileForm.validateFields(),
    goodsEdit.validate(),
    expertEdit.validate(),
    gradeEdit.validate(),
    supplierEdit?.validate(),
  ]).then((result) => {
    proxy.$confirm({
      content: '请确认是否提交招标信息',
      onOk() {
        return new Promise((resolve, reject) => {
          const info = result[0];
          const user = result[1];
          const bidRuleParam = result[2];
          const files = result[3];
          if (Array.isArray(info.demandDeptId)) {
            info.demandDeptId = info.demandDeptId.slice(-1)[0];
          }
          if (Array.isArray(bidRuleParam.prequalificationUrlListJson)) {
            bidRuleParam.prequalificationUrlListJson =
              bidRuleParam.prequalificationUrlListJson[0].url;
          }
          if (Array.isArray(files.tendereeAttachmentUrlListJson)) {
            files.tendereeAttachmentUrlListJson = files.tendereeAttachmentUrlListJson[0].url;
          }
          if (Array.isArray(files.businessAttachmentUrlListJson)) {
            files.businessAttachmentUrlListJson = files.businessAttachmentUrlListJson[0].url;
          }
          if (Array.isArray(files.technologyAttachmentUrlListJson)) {
            files.technologyAttachmentUrlListJson = files.technologyAttachmentUrlListJson[0].url;
          }

          const bidItemParamList = result[4];
          bidItemParamList.forEach((item) => {
            if (
              item.attachmentUrlList &&
              Array.isArray(item.attachmentUrlList) &&
              item.attachmentUrlList.length > 0
            ) {
              item.attachmentUrlListJson = item.attachmentUrlList[0].url;
            } else {
              item.attachmentUrlListJson = '';
            }
            if (Array.isArray(item.categoryId)) {
              item.categoryId = item.categoryId.slice(-1)[0];
            }
          });

          const bidExpertParamList = result[5];
          const bidGradeParamList = result[6];
          const supplierIdList = result[7]?.map((item) => item.id);

          const params = {
            ...info,
            ...user,
            bidRuleParam,
            ...files,
            bidItemParamList,
            bidExpertParamList,
            bidGradeParamList,
            id: props.id,
            supplierIdList,
          };
          console.log(params);

          const api = props.id ? bidEdit : bidAdd;
          const message = props.id ? '保存成功' : '提交成功';
          submitLoading.value = true;
          api(params)
            .then(() => {
              resolve();
              proxy.$message.success(message);
              proxy.$router.go(-1);
            })
            .catch(() => reject())
            .finally(() => {
              submitLoading.value = false;
            });
        });
      },
    });
  });
};
</script>

<style lang="less" scoped></style>
