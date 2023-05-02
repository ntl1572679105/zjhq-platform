<template>
  <PageContainer>
    <CommonTitleAction title="采购订单详情" />
    <div class="bg-main">
      <a-skeleton active :loading="loading">
        <CommonSubTitle title="基本信息" />
        <CommonForm :canDisabled="true" :formItems="formItems" :formData="formData" />

        <CommonSubTitle title="产品信息" />
        <ReceiveGoods :data="dataSource.goods" />

        <template v-for="(item, index) in dataSource.orders" :key="index">
          <CommonSubTitle :title="`收货单${index + 1}-${item.deliveryItems[0].bidItem.name}`" />
          <ReceiveOrder :data="item" @finish="refresh" />
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
import { orderBiddingDetail, orderReceiveList } from '@/api/operator/order.js';
import ReceiveGoods from './components/ReceiveGoods.vue';
import ReceiveOrder from './components/ReceiveOrder.vue';

const loading = ref(false);
const { proxy } = getCurrentInstance();
const props = defineProps({
  id: String,
  type: String, // 1: 查看 2: 收货
});

// 表单配置
const formItems = ref([
  {
    type: 'text',
    label: '订单编号',
    value: 'orderId',
    rules: true,
  },
  {
    type: 'number',
    label: '订单总金额（含税）',
    value: 'taxTotalAmount',
    rules: true,
  },
  {
    type: 'text',
    label: '企业名称',
    value: 'companyName',
    rules: true,
  },
  {
    type: 'text',
    label: '创建人',
    value: 'createBy',
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

const dataSource = reactive({
  goods: [],
  orders: [],
});

const formData = ref({});

onMounted(() => {
  // 组装默认的formData
  formItems.value.forEach((child) => {
    formData.value[child.value] = undefined;
  });

  props.id && getDetail(props.id);
});

const getDetail = () => {
  loading.value = true;
  orderBiddingDetail(props.id)
    .then((res) => {
      Object.keys(formData.value).forEach((el) => {
        formData.value[el] = res[el] ?? undefined;
      });

      dataSource.goods = res.bidItems;
      orderReceiveList({ orderBiddingId: props.id }).then((orders) => {
        dataSource.orders = orders;
      });
    })
    .finally(() => {
      loading.value = false;
    });
};

const refresh = () => {
  // props.id && getDetail(props.id);
  proxy.$router.replace({
    path: `/purchasingManagement/order-list/receive/${props.type}/${props.id}`,
  });
};
</script>

<style lang="less" scoped></style>
