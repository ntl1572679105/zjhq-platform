<template>
  <PageContainer>
    <CommonTitleAction title="竞价管理">
      <template #right v-if="type === '2'">
        <a-button :loading="submitLoading" @click="onFinish" type="primary">提交</a-button>
      </template>
    </CommonTitleAction>
    <div class="bg-main flex">
      <a-skeleton active :loading="loading">
        <div style="width: 100%; overflow: hidden">
          <CommonSubTitle title="基本信息" />
          <CommonForm :canDisabled="true" :formItems="formItems" :formData="formData" />

          <GoodsEdit ref="resultForm" :data="dataSource.goods" :canDisabled="type !== '2'" />
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
import { orderDtail, orderAdd, orderBiddingDetail } from '@/api/supplier/order.js';
import GoodsEdit from './components/GoodsEdit.vue';

const loading = ref(false);
const { proxy } = getCurrentInstance();
const props = defineProps({
  id: String,
  type: String, // 1: 查看 2：发起 3:已发起
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

const formData = ref({});

const dataSource = reactive({
  goods: [],
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
  const api = props.type === '3' ? orderBiddingDetail : orderDtail;
  api(props.id)
    .then((res) => {
      Object.keys(formData.value).forEach((el) => {
        formData.value[el] = res[el] ?? undefined;
      });

      if (res.orderItemVos) {
        dataSource.goods = res.orderItemVos;
      } else {
        dataSource.goods = res.bidItems.map((item) => ({ ...item, categoryIds: item.productId }));
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
  resultForm.validate().then((result) => {
    const bidItemParams = result.map((item) => ({
      biddingPrice: item.biddingPrice,
      orderItemId: item.id,
      taxRate: item.taxRate,
    }));
    submitLoading.value = true;
    orderAdd({ bidItemParams, orderId: props.id })
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
