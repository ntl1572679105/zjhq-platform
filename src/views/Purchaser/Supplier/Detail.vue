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
            :canDisabled="pageState.canDisabled"
            :formData="formData[0]"
          />
          <CommonSubTitle title="主要联系人" />
          <CommonForm
            ref="userForm"
            :formItems="formItems[1]"
            :canDisabled="pageState.canDisabled"
            :formData="formData[1]"
          />
          <CommonSubTitle title="工商信息" />
          <CommonForm
            ref="companyForm"
            :formItems="formItems[2]"
            :canDisabled="pageState.canDisabled"
            :formData="formData[2]"
          />
          <CommonSubTitle title="工商信息" />
          <FileEdit
            ref="fileForm"
            :data="dataSource.list"
            :canDisabled="pageState.canDisabled"
          ></FileEdit>
        </div>
        <FlowContainer
          v-if="approval.businessKey"
          :businessKey="approval.businessKey"
          :api="supplierApproval"
          :params="{ id: id }"
          name="资质审核"
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
import FileEdit from './components/FileEdit.vue';
import {
  supplierDetail,
  supplierAdd,
  supplierUpdate,
  supplierApproval,
} from '@/api/operator/supplier.js';
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
  type: String, // 1:查看 2:编辑 3:审批
});

// 标题及按钮
const pageState = reactive({
  title: '',
  buttonTitle: '',
  canDisabled: false,
});

const setupPage = () => {
  if (props.type) {
    pageState.title = ['', '供应商详情', '编辑供应商', '供应商资质审核'][props.type];
    if (props.type === '2') {
      pageState.buttonTitle = '保存';
      pageState.canDisabled = false;
    } else {
      pageState.buttonTitle = '';
      pageState.canDisabled = true;
    }
  } else {
    pageState.title = '供应商准入';
    pageState.buttonTitle = '提交';
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

const dataSource = reactive({ list: [], alertAmount: 0 });

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
  supplierDetail(props.id)
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
            child[el] = res[el] || undefined;
          }
        });
      });

      approval.businessKey = res.businessKey;

      dataSource.list =
        res.supplierCertifications?.map((item) => ({
          ...item,
          url: setupFile(item, 'url'),
          productionCertificate: setupFile(item, 'productionCertificate'),
        })) ?? [];
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

// 提交保存
const submitLoading = ref(false);
const onFinish = () => {
  const { infoForm, userForm, companyForm, fileForm } = proxy.$refs;
  Promise.all([
    infoForm.validateFields(),
    userForm.validateFields(),
    companyForm.validateFields(),
    fileForm.validate(),
  ]).then((result) => {
    proxy.$confirm({
      content: '请确认是否提交信息',
      onOk() {
        return new Promise((resolve, reject) => {
          const info = result[0];
          const user = result[1];
          const company = result[2];
          const files = result[3];
          if (Array.isArray(company.businessLicenseUrl)) {
            company.businessLicenseUrl = company.businessLicenseUrl[0].url;
          }
          if (company.businessLicenseValidTime) {
            company.businessLicenseValidBeginTime = company.businessLicenseValidTime[0];
            company.businessLicenseValidEndTime = company.businessLicenseValidTime[1];
            company.businessLicenseValidTime = null;
          }
          if (company.address && Array.isArray(company.address)) {
            const province = company.address[0];
            const city = company.address[1];
            const district = company.address[2];
            company.province = province;
            company.city = city;
            company.district = district;
            company.address = `${province} ${city} ${district}`;
          }

          const certificationParams = files.map((item) => ({
            ...item,
            url: item.url[0]?.url ?? null,
            productionCertificate: item.productionCertificate[0]?.url ?? null,
          }));

          const params = { ...info, ...user, ...company, certificationParams, id: props.id };
          console.log(params);

          const api = props.id ? supplierUpdate : supplierAdd;
          const message = props.id ? '保存成功' : '提交成功';
          submitLoading.value = true;
          api(params)
            .then(() => {
              resolve();
              proxy.$message.success(message);
              proxy.$router.go(-1);
            })
            .catch((error) => {
              reject(error);
            })
            .finally(() => {
              submitLoading.value = false;
            });
        }).catch((error) => console.log(error));
      },
    });
  });
};
</script>

<style lang="less" scoped></style>
