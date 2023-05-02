<template>
  <div class="bg-main flex-row">
    <div class="bg-left">
      <router-link :to="{ path: '/' }">
        <img src="@/assets/images/HomePage/logo@2x.png" class="left_logo" />
      </router-link>
      <img src="@/assets/images/Supplier/icon_supplier_register@2x.png" class="left_title" />
      <img src="@/assets/images/Supplier/icon_supplier_register1@2x.png" class="left_img" />
    </div>
    <div class="bg-right">
      <a-skeleton active :loading="loading">
        <CommonSubTitle title="基本信息" />
        <CommonForm ref="infoForm" :formItems="formItems[0]" :formData="formData[0]" />
        <CommonSubTitle title="主要联系人" />
        <CommonForm ref="userForm" :formItems="formItems[1]" :formData="formData[1]" />
        <CommonSubTitle title="工商信息" />
        <CommonForm ref="companyForm" :formItems="formItems[2]" :formData="formData[2]" />

        <a-button class="operate_button" :loading="submitLoading" @click="onFinish" type="primary"
          >注册申请</a-button
        >
      </a-skeleton>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance, reactive } from 'vue';
import CommonForm from '@/components/CommonForm/index.vue';
import CommonSubTitle from '@/components/CommonSubTitle/index.vue';
import { supplierSAdd } from '@/api/operator/supplier.js';
import {
  getSexDict,
  getCompanyTypeDict,
  getCountryDict,
  getCreditRatingDict,
  getIndustryTypeDict,
  categoryAll,
} from '@/api/common';
import { cascaderOptions } from '@/utils/pca.js';

const loading = ref(false);
const { proxy } = getCurrentInstance();
const props = defineProps({
  invitationId: String,
});

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

const formData = ref(new Array(formItems.value.length).fill([]));

onMounted(() => {
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
  const { infoForm, userForm, companyForm } = proxy.$refs;
  Promise.all([
    infoForm.validateFields(),
    userForm.validateFields(),
    companyForm.validateFields(),
  ]).then((result) => {
    proxy.$confirm({
      content: '请确认是否提交信息',
      onOk() {
        return new Promise((resolve, reject) => {
          const info = result[0];
          const user = result[1];
          const company = result[2];
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
          const params = { ...info, ...user, ...company, invitationId: props.invitationId };
          console.log(params);

          submitLoading.value = true;
          supplierSAdd(params)
            .then(() => {
              proxy.$message.success('提交成功');
              proxy.$router.replace('/');
              resolve();
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

<style lang="less" scoped>
.bg-main {
  .bg-left {
    background-color: #005be3;
    flex: 1;
    max-width: 500px;
    min-width: 350px;
    .left_logo {
      width: 90px;
      height: 16px;
      position: fixed;
      top: 24px;
      left: 24px;
    }
    .left_title {
      width: 252px;
      height: 101px;
      position: fixed;
      top: 150px;
      left: 48px;
    }
    .left_img {
      width: 274px;
      height: 274px;
      position: fixed;
      left: (50% - 45px);
      bottom: 0;
    }
  }
  .bg-right {
    flex: 4;
    padding: 32px 24px;
  }
}
.operate_button {
  margin: 20px 40px;
  width: 200px;
}
</style>
