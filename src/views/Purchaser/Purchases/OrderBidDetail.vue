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
          <CommonForm :canDisabled="true" :formItems="formItems" :formData="formData" />

          <CommonSubTitle title="产品信息" />
          <ProductEdit categoryId="null" :canDisabled="true" :data="dataSource.products" />

          <template v-if="dataSource.type === 0 && type !== '2'">
            <CommonSubTitle title="竞价信息" />
            <CommonForm
              :canDisabled="pageState.canDisabled"
              ref="infoForm"
              :formItems="formItems2"
              :formData="formData2"
              @selectChange="typeChange"
            />

            <template v-if="dataSource.biddingType === 1">
              <CommonSubTitle title="供应商" />
              <SupplierEdit
                ref="supplierEdit"
                :data="dataSource.suppliers"
                :canDisabled="pageState.canDisabled"
              />
            </template>
          </template>
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
import { orderDetail, orderBidAdd } from '@/api/operator/order.js';
import { getDeliverTypeDict } from '@/api/common';
import { userList } from '@/api/erp/common';
import ProductEdit from './components/ProductEdit.vue';
import SupplierEdit from './components/SupplierEdit.vue';

const loading = ref(false);
const { proxy } = getCurrentInstance();
const props = defineProps({
  id: String,
  type: String, // 1:查看 2:管理列表未提交查看
});

// 标题及按钮
const pageState = reactive({
  title: '',
  buttonTitle: '',
  canDisabled: false,
});

const setupPage = () => {
  if (props.type === '1') {
    pageState.title = ['', '采购订单竞价详情'][props.type];
    pageState.buttonTitle = '';
    pageState.canDisabled = true;
  } else {
    pageState.title = '采购订单竞价';
    pageState.buttonTitle = '提交';
  }
};

// 表单配置
const formItems = ref([
  {
    type: 'text',
    label: '订单编号',
    value: 'id',
    rules: true,
  },
  {
    type: 'select',
    label: '订单类型',
    value: 'type',
    rules: true,
    options: [
      { label: '竞价订单', value: 0, key: 'type' },
      { label: '录入订单', value: 1, key: 'type' },
      { label: '直采订单', value: 2, key: 'type' },
    ],
  },
  {
    type: 'number',
    label: '订单总金额（含税）',
    value: 'taxPrice',
    rules: true,
  },
  {
    type: 'text',
    label: '企业名称',
    value: 'companyName',
    rules: true,
  },
  {
    type: 'select',
    label: '配送方式',
    value: 'deliveryType',
    rules: true,
    options: [],
  },
  {
    type: 'text',
    label: '配送地址',
    value: 'address',
    rules: true,
  },
  {
    type: 'textarea',
    label: '备注',
    value: 'remark',
    rules: true,
  },
]);

const formItems2 = ref([
  {
    type: 'select',
    label: '竞价负责人',
    value: 'biddingPrincipalId',
    options: [],
    rules: true,
  },
  {
    type: 'rangedatepicker',
    label: '竞价时间',
    value: 'time',
    rules: true,
    format: 'YYYY-MM-DD',
    valueFormat: 'YYYY-MM-DD',
    width: 16,
  },
  {
    type: 'select',
    label: '竞价参与对象',
    value: 'biddingParticipateId',
    options: [],
    rules: true,
  },
  {
    type: 'datepicker',
    label: '结果公布时间',
    value: 'biddingResultTime',
    showTime: true,
    valueFormat: 'YYYY-MM-DD HH:mm:ss',
    rules: true,
  },
  {
    type: 'select',
    label: '竞价方式',
    value: 'biddingType',
    rules: true,
    options: [
      { label: '公开', value: 0, key: 'biddingType' },
      { label: '邀请', value: 1, key: 'biddingType' },
    ],
  },
  {
    type: 'number',
    label: '最小竞价供应商数',
    value: 'minSupplierNumber',
    rules: true,
    hidden: true,
  },
  {
    type: 'number',
    label: '最大竞价供应商数',
    value: 'maxSupplierNumber',
    rules: true,
    hidden: true,
  },
]);

const dataSource = reactive({
  products: [],
  type: null, // 0: 只有竞价订单才有竞价信息
  biddingType: null,
  suppliers: [],
});

const formData = ref({});
const formData2 = ref({});

onMounted(() => {
  setupPage();
  // 组装默认的formData
  formItems.value.forEach((child) => {
    formData.value[child.value] = undefined;
  });
  formItems2.value.forEach((child) => {
    formData2.value[child.value] = undefined;
  });
  getSelectList();
  props.id && getDetail(props.id);
});

const getDetail = () => {
  loading.value = true;
  orderDetail(props.id)
    .then((res) => {
      Object.keys(formData.value).forEach((el) => {
        formData.value[el] = res[el] ?? undefined;
      });
      Object.keys(formData2.value).forEach((el) => {
        formData2.value[el] = res[el] ?? undefined;
      });
      formData2.value.time = res.biddingBeginTime ? [res.biddingBeginTime, res.biddingEndTime] : [];

      dataSource.products = res.orderItemVos;
      // dataSource.biddingType = res.biddingType;
      dataSource.suppliers = res.suppliers?.map((item) => ({ ...item, supplierId: item.id }));
      dataSource.type = res.type;
      if (res.type === 0) {
        formItems.value[6].hidden = true;
        typeChange({ value: res.biddingType ?? 0 });
      } else if (res.type === 1) {
        formItems.value[4].hidden = true;
        formItems.value[5].hidden = true;
        formItems.value[6].hidden = true;
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

const getSelectList = () => {
  getDeliverTypeDict().then((res) => {
    formItems.value[3].options = res.map((item) => ({ label: item.dictKey, value: item.dictKey }));
  });
  userList().then((res) => {
    const list = res.map((item) => ({ label: item.userName, value: item.id }));
    formItems2.value[0].options = list;
    formItems2.value[2].options = list;
  });
};

const typeChange = ({ value, option }) => {
  dataSource.biddingType = value;
  if (value === 1) {
    formItems2.value[5].hidden = true;
    formItems2.value[6].hidden = true;
  } else if (value === 0) {
    formItems2.value[5].hidden = false;
    formItems2.value[6].hidden = false;
  }
  proxy.$refs.infoForm && proxy.$refs.infoForm.resetRules();
};

// 提交保存
const submitLoading = ref(false);
const onFinish = () => {
  const { infoForm, supplierEdit } = proxy.$refs;
  Promise.all([infoForm.validateFields(), supplierEdit?.validate()]).then((result) => {
    proxy.$confirm({
      content: '请确认是否提交竞价',
      onOk() {
        return new Promise((resolve, reject) => {
          const info = result[0];
          if (info.time) {
            info.biddingBeginTime = info.time[0];
            info.biddingEndTime = info.time[1];
            info.time = undefined;
          }
          const supplierIds = result[1]?.map((item) => item.id);
          const requestParams = { ...info, supplierIds, id: props.id };
          console.log(requestParams);
          submitLoading.value = true;
          orderBidAdd(requestParams)
            .then(() => {
              resolve();
              proxy.$message.success('提交成功');
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
