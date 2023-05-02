<template>
  <PageContainer>
    <CommonTitleAction :title="dataSource.pageTitle" />
    <div class="bg-main flex">
      <a-skeleton active :loading="loading">
        <div style="width: 100%; overflow: hidden">
          <CommonSubTitle title="基本信息" />
          <CommonForm :canDisabled="true" :formItems="formItems" :formData="formData" />

          <template v-for="(item, index) in dataSource.suppliers" :key="index">
            <CommonSubTitle :title="item.supplierName" />
            <SupplierProduct :data="item" />
          </template>

          <CommonSubTitle :title="dataSource.biddingStatus === 1 ? '竞价结果录入' : '竞价结果'" />
          <CommonForm
            :canDisabled="dataSource.biddingStatus !== 1"
            ref="resultForm"
            :formItems="formItems2"
            :formData="formData2"
          />
          <a-button
            v-if="dataSource.biddingStatus === 1"
            :loading="submitLoading"
            @click="onFinish"
            type="primary"
            class="operate_button"
            >确认提交</a-button
          >
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
import { orderDetail, orderBidSupplierPage, orderBidding } from '@/api/operator/order.js';
import SupplierProduct from './components/SupplierProduct.vue';

const loading = ref(false);
const { proxy } = getCurrentInstance();
const props = defineProps({
  id: String,
});

// 表单配置
const formItems = ref([
  {
    type: 'text',
    label: '订单编号',
    value: 'id',
    rules: true,
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
    type: 'radio-group',
    label: '供应商',
    value: 'biddingId',
    rules: true,
    options: [],
  },
  {
    type: 'textarea',
    label: '选取依据',
    value: 'biddingRemark',
    rules: true,
  },
]);

const formData = ref({});
const formData2 = ref({ biddingId: undefined, biddingRemark: '' });

const dataSource = reactive({
  biddingStatus: null,
  pageTitle: '订单竞价详情',
  suppliers: [],
});

onMounted(() => {
  // 组装默认的formData
  formItems.value.forEach((child) => {
    formData.value[child.value] = undefined;
  });

  props.id && getDetail(props.id);
});

const getDetail = () => {
  loading.value = true;
  Promise.all([orderDetail(props.id), orderBidSupplierPage({ orderId: props.id })])
    .then((result) => {
      const detail = result[0];
      Object.keys(formData.value).forEach((el) => {
        formData.value[el] = detail[el] ?? undefined;
      });

      dataSource.biddingStatus = detail.biddingStatus;
      dataSource.pageTitle = detail.biddingStatus === 1 ? '订单竞价审核' : '订单竞价详情';

      dataSource.suppliers = result[1];
      formItems2.value[0].options = dataSource.suppliers.map((item) => ({
        label: item.supplierName,
        value: item.id,
      }));
      const selectSupplier = dataSource.suppliers.find((item) => item.status === 1);
      if (selectSupplier) {
        formData2.value.biddingId = selectSupplier.id;
        formData2.value.biddingRemark = detail.biddingRemark;
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

// 提交保存
const submitLoading = ref(false);
const onFinish = () => {
  const { resultForm } = proxy.$refs;
  resultForm.validateFields().then((result) => {
    submitLoading.value = true;
    orderBidding({ ...result, id: props.id })
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

<style lang="less" scoped>
.operate_button {
  margin-top: 12px;
  margin-left: 33px;
  margin-bottom: 20px;
}
</style>
