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
            @selectChange="selectChange"
          />

          <template v-if="dataSource.categoryId">
            <CommonSubTitle title="产品信息" />
            <ProductEdit
              ref="productEdit"
              :canDisabled="pageState.canDisabled"
              :categoryId="dataSource.categoryId"
              :data="dataSource.products"
            />
          </template>
        </div>
        <FlowContainer
          v-if="approval.businessKey && pageState.canDisabled"
          :businessKey="approval.businessKey"
          :api="orderApproval"
          :params="{ id: id }"
          name="订单审核"
        />
      </a-skeleton>
    </div>
  </PageContainer>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance, reactive, createVNode } from 'vue';
import CommonTitleAction from '@/components/CommonTitleAction/index.vue';
import CommonForm from '@/components/CommonForm/index.vue';
import CommonSubTitle from '@/components/CommonSubTitle/index.vue';
import { orderAdd, orderEdit, orderDetail, orderApproval } from '@/api/operator/order.js';
import { getDeliverTypeDict, budgetDetail, categoryAll, supplierList } from '@/api/common';
import ProductEdit from './components/ProductEdit.vue';
import FlowContainer from '@/components/Flow/index.vue';

const loading = ref(false);
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
    pageState.title = ['', '订单详情', '编辑订单', '订单审批'][props.type];
    if (props.type === '2') {
      pageState.buttonTitle = '保存';
      pageState.canDisabled = false;
    } else {
      pageState.buttonTitle = '';
      pageState.canDisabled = true;
    }
  } else {
    pageState.title = '新建订单';
    pageState.buttonTitle = '提交';
  }
};

// 表单配置
const formItems = ref([
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
    type: 'text',
    label: '企业名称',
    value: 'companyName',
    rules: true,
  },
  {
    type: 'select',
    label: '采购品类',
    value: 'categoryId',
    rules: true,
    options: [],
  },
  {
    type: 'number',
    label: '订单总金额（含税）',
    value: 'taxPrice',
    hidden: true,
  },
  {
    type: 'select',
    label: '配送方式',
    value: 'deliveryType',
    rules: true,
    options: [],
    hidden: true,
  },
  {
    type: 'text',
    label: '配送地址',
    value: 'address',
    rules: true,
    hidden: true,
  },
  {
    type: 'select',
    label: '供应商',
    value: 'supplierId',
    rules: true,
    options: [],
    hidden: true,
  },
  {
    type: 'textarea',
    label: '备注',
    value: 'remark',
    rules: true,
  },
]);

const dataSource = reactive({
  categoryId: undefined,
  products: [],
});

const formData = ref({});

onMounted(() => {
  setupPage();
  if (pageState.canDisabled) {
    formItems.value[3].hidden = false;
  }
  // 组装默认的formData
  formItems.value.forEach((child) => {
    formData.value[child.value] = undefined;
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

      dataSource.products = res.orderItemVos;
      dataSource.categoryId = res.categoryId;
      selectChange({ value: res.type, option: { key: 'type' } });
      if (res.type === 0) {
        approval.businessKey = res.businessKey;
      } else if (res.type === 2) {
        const supplier = res.suppliers ? res.suppliers[0] : {};
        formData.value.supplierId = supplier?.id;
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

const getSelectList = () => {
  categoryAll().then((res) => {
    formItems.value[2].options = res.map((item) => ({
      label: item.name,
      value: item.id,
      key: 'categoryAll',
    }));
  });
  getDeliverTypeDict().then((res) => {
    formItems.value[4].options = res.map((item) => ({ label: item.dictKey, value: item.dictKey }));
  });
};

const selectChange = ({ value, option }) => {
  if (option.key === 'categoryAll') {
    dataSource.categoryId = value;
  } else if (option.key === 'type') {
    if (value === 0) {
      formItems.value[4].hidden = false;
      formItems.value[5].hidden = false;
      formItems.value[6].hidden = true;
    } else if (value === 1) {
      formItems.value[4].hidden = true;
      formItems.value[5].hidden = true;
      formItems.value[6].hidden = true;
    } else {
      formItems.value[4].hidden = false;
      formItems.value[5].hidden = false;
      formItems.value[6].hidden = false;
      if (formItems.value[6].options && formItems.value[6].options.length === 0) {
        getSupplierList();
      }
    }
    proxy.$refs.infoForm && proxy.$refs.infoForm.resetRules();
  }
};

const getSupplierList = () => {
  supplierList().then((res) => {
    formItems.value[6].options = res.map((item) => ({ label: item.name, value: item.id }));
  });
};

/// 审批
const approval = reactive({
  businessKey: '',
});

// 提交保存
const submitLoading = ref(false);
const onFinish = () => {
  const { infoForm, productEdit } = proxy.$refs;
  Promise.all([infoForm.validateFields(), productEdit?.validate()]).then((result) => {
    const info = result[0];
    const params = result[1];
    const requestParams = { ...info };
    if (props.id) {
      requestParams.orderItems = params;
    } else {
      requestParams.params = params;
    }
    const budgetPrice = params?.reduce((pre, cur) => pre + cur.demand * cur.taxPrice, 0);
    console.log(requestParams, budgetPrice);
    submitLoading.value = true;
    alertWarn(requestParams, budgetPrice);
  });
};

const alertWarn = (requestParams, budgetPrice) => {
  budgetDetail(dataSource.categoryId).then((res) => {
    proxy.$confirm({
      title: '预算提醒',
      content: createVNode('div', {}, [
        createVNode('div', {}, `预算余额：${res.residualBudget}元`),
        createVNode('div', {}, `本次采购扣除金额：${Number(budgetPrice).toFixed(2)}元`),
        createVNode('div', {}, '请合理分配预算金额'),
      ]),
      onOk: () => {
        const api = props.id ? orderEdit : orderAdd;
        const message = props.id ? '保存成功' : '提交成功';
        api(requestParams)
          .then(() => {
            proxy.$message.success(message);
            proxy.$router.go(-1);
          })
          .finally(() => {
            submitLoading.value = false;
          });
      },
      onCancel: () => {
        submitLoading.value = false;
      },
    });
  });
};
</script>

<style lang="less" scoped></style>
