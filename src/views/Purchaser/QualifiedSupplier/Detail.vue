<template>
  <PageContainer>
    <CommonTitleAction :title="pageState.title" />
    <div class="bg-main flex">
      <a-skeleton active :loading="loading">
        <div style="width: 100%; overflow: hidden">
          <CommonSubTitle title="基本信息" />
          <CommonForm
            :formItems="formItems[0]"
            :canDisabled="pageState.canDisabled"
            :formData="formData[0]"
          />
          <CommonSubTitle title="主要联系人" />
          <CommonForm
            :formItems="formItems[1]"
            :canDisabled="pageState.canDisabled"
            :formData="formData[1]"
          />
          <CommonSubTitle title="工商信息" />
          <CommonForm
            :formItems="formItems[2]"
            :canDisabled="pageState.canDisabled"
            :formData="formData[2]"
          />
          <CommonSubTitle title="工商信息" />
          <FileEdit :data="dataSource.list" :canDisabled="pageState.canDisabled"></FileEdit>

          <CommonSubTitle title="认证服务" />
          <BidList :data="dataSource.bids"></BidList>
        </div>
        <FlowContainer
          v-if="approval.businessKey"
          :businessKey="approval.businessKey"
          :api="approvalQualifiedAudit"
          :params="{ id: id }"
          :name="pageState.title"
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
import FileEdit from '../Supplier/components/FileEdit.vue';
import BidList from './components/BidList.vue';
import { supplierQualifiedDetail, approvalQualifiedAudit } from '@/api/operator/supplier.js';
import {
  getSexDict,
  getCompanyTypeDict,
  getCountryDict,
  getCreditRatingDict,
  getIndustryTypeDict,
  categoryAll,
} from '@/api/common';
import { cascaderOptions } from '@/utils/pca.js';
import FlowContainer from '@/components/Flow/index.vue';

const loading = ref(false);
const fileLoading = ref(false);
const { proxy } = getCurrentInstance();
const props = defineProps({
  id: String,
  type: String, // 1:查看 2:启用/淘汰 审批
});

// 标题及按钮
const pageState = reactive({
  title: '',
  buttonTitle: '',
  canDisabled: true,
});

const setupPage = () => {
  if (props.type) {
    pageState.title = ['', '合格供应商详情', '合格供应商申请'][props.type];
    pageState.canDisabled = true;
  }
};

// 表单配置
const formItems = ref([
  [
    {
      type: 'text',
      label: '供应商名称',
      value: 'name',
      rules: true,
    },
    // {
    //   type: 'text',
    //   label: '统一社会信用代码',
    //   value: 'uniformCreditCode',
    //   rules: true,
    // },
    // {
    //   type: 'text',
    //   label: '供应商编号',
    //   value: 'id',
    // },
    {
      type: 'select',
      label: '服务范围',
      value: 'serviceScopes',
      rules: true,
      mode: 'multiple',
      options: [],
    },
    {
      type: 'select',
      label: '企业性质',
      value: 'companyType',
      options: [],
      rules: true,
    },
  ],
  [
    {
      type: 'text',
      label: '姓名',
      value: 'linkman',
      rules: true,
    },
    // {
    //   type: 'select',
    //   label: '性别',
    //   value: 'linkmanSex',
    //   options: [],
    //   rules: true,
    // },
    {
      type: 'text',
      label: '职务',
      value: 'linkmanPost',
    },
    {
      type: 'text',
      label: '邮箱地址',
      value: 'linkmanEmail',
      rules: true,
    },
    {
      type: 'text',
      label: '手机号',
      value: 'linkmanPhone',
      rules: true,
    },
  ],
  [
    {
      type: 'text',
      label: '法人',
      value: 'legalPerson',
      rules: true,
    },
    {
      type: 'text',
      label: '法人身份证号',
      value: 'legalPersonId',
      rules: true,
    },
    {
      type: 'text',
      label: '职务',
      value: 'legalPersonPost',
    },
    {
      type: 'text',
      label: '开户行',
      value: 'depositBank',
      rules: true,
    },
    {
      type: 'text',
      label: '开户行帐号',
      value: 'depositBankAccount',
      rules: true,
    },
    {
      type: 'text',
      label: '注册资金',
      value: 'registerFund',
      rules: true,
    },
    {
      type: 'file',
      label: '营业执照',
      value: 'businessLicenseUrl',
      rules: true,
    },
    {
      type: 'rangedatepicker',
      label: '证件开始截止日期',
      value: 'businessLicenseValidTime',
      valueFormat: 'YYYY-MM-DD',
      rules: true,
    },
    {
      type: 'text',
      label: '工商注册地址',
      value: 'registerAddress',
      rules: true,
    },
    {
      type: 'text',
      label: '座机',
      value: 'landlineNumber',
      rules: true,
    },
    // {
    //   type: 'select',
    //   label: '所属国家',
    //   value: 'country',
    //   options: [],
    //   rules: true,
    // },
    {
      type: 'cascader',
      label: '所属地区',
      value: 'address',
      options: cascaderOptions,
      rules: true,
    },
    {
      type: 'select',
      label: '行业类别',
      value: 'industryType',
      options: [],
      rules: true,
    },
    // {
    //   type: 'select',
    //   label: '信用等级',
    //   value: 'creditRating',
    //   options: [],
    //   rules: true,
    // },
    {
      type: 'textarea',
      label: '公司介绍',
      value: 'introInfo',
      rules: true,
      width: 12,
    },
    {
      type: 'textarea',
      label: '主营业务',
      value: 'majorBusiness',
      rules: true,
      width: 12,
    },
  ],
]);

const dataSource = reactive({ list: [], bids: [] });

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
  // 获取详情
  props.id && getDetail(props.id);
});

const getDetail = () => {
  loading.value = true;
  fileLoading.value = true;
  supplierQualifiedDetail(props.id)
    .then((res) => {
      formData.value.forEach((child) => {
        Object.keys(child).forEach((el) => {
          if (el === 'businessLicenseUrl') {
            // 营业执照
            child[el] = [
              {
                status: 'done',
                url: res.businessLicenseUrl,
                uid: new Date().getTime(),
                name: res.businessLicenseUrl.split('/').pop(),
              },
            ];
          } else if (el === 'businessLicenseValidTime') {
            child[el] = [res.businessLicenseValidBeginTime, res.businessLicenseValidEndTime];
          } else if (el === 'address') {
            child[el] = [res.province, res.city, res.district];
          } else if (el === 'serviceScopes') {
            child[el] = res.serviceScope.split(',');
          } else {
            child[el] = res[el] ?? undefined;
          }
        });
      });

      approval.businessKey = res.lastApply.businessKey;
      if (props.type === '2') {
        pageState.title = `合格供应商${res.lastApply.type === 1 ? '启用' : '淘汰'}申请`;
      }

      dataSource.list =
        res.supplierCertifications?.map((item) => ({
          ...item,
          url: setupFile(item, 'url'),
          productionCertificate: setupFile(item, 'productionCertificate'),
        })) ?? [];
      dataSource.bids = res.bidList;
    })
    .finally(() => {
      loading.value = false;
      fileLoading.value = false;
    });
};

const setupFile = (item, key) => {
  if (item && item[key]) {
    return [
      {
        status: 'done',
        url: item[key],
        uid: new Date().getTime(),
        name: item[key].split('/').pop(),
      },
    ];
  } else {
    return [];
  }
};

/// 审批
const approval = reactive({
  businessKey: '',
});

// 获取字典内容
const getDict = () => {
  getCompanyTypeDict().then((res) => {
    formItems.value[0][2].options = res.map((item) => ({
      label: item.dictKey,
      value: item.dictKey,
    }));
  });
  // getSexDict().then((res) => {
  //   formItems.value[1][1].options = res.map((item) => ({
  //     label: item.dictKey,
  //     value: item.dictKey,
  //   }));
  // });
  // getCountryDict().then((res) => {
  //   formItems.value[2][10].options = res.map((item) => ({
  //     label: item.dictKey,
  //     value: item.dictKey,
  //   }));
  // });
  getIndustryTypeDict().then((res) => {
    formItems.value[2][11].options = res.map((item) => ({
      label: item.dictKey,
      value: item.dictKey,
    }));
  });
  // getCreditRatingDict().then((res) => {
  //   formItems.value[2][13].options = res.map((item) => ({
  //     label: item.dictKey,
  //     value: item.dictKey,
  //   }));
  // });
  categoryAll().then((res) => {
    formItems.value[0][1].options = res.map((item) => ({
      label: item.name,
      value: item.id,
    }));
  });
};
</script>

<style lang="less" scoped></style>
