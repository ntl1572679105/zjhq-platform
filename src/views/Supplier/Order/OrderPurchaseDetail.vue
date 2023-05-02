<template>
  <PageContainer>
    <CommonTitleAction title="采购订单详情">
      <template #right v-if="type === '2'">
        <a-button :loading="submitLoading" @click="onFinish" type="primary">提交</a-button>
      </template>
    </CommonTitleAction>
    <div class="bg-main">
      <a-skeleton active :loading="loading">
        <CommonSubTitle title="基本信息" />
        <CommonForm :canDisabled="true" :formItems="formItems" :formData="formData" />

        <CommonSubTitle title="产品信息" />
        <DeliveryGoods :canDisabled="type === '1'" :data="dataSource.goods" @addOrder="addOrder" />

        <template v-for="(item, index) in dataSource.orders" :key="index">
          <CommonSubTitle :title="`送货单${index + 1}-${item.deliveryItems[0].bidItem.name}`" />
          <DeliveryOrder :data="item" :canDisabled="true" />
        </template>
        <template v-if="dataSource.isAdded">
          <CommonSubTitle
            :title="`送货单${dataSource.orders.length + 1}-${
              dataSource.currentItems.deliveryItems[0].bidItem.name
            }`"
          />
          <DeliveryOrder ref="deliveryOrder" :data="dataSource.currentItems" />
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
import { orderBiddingDetail, orderDeliveryPage, orderDeliveryAdd } from '@/api/supplier/order.js';
import DeliveryGoods from './components/DeliveryGoods.vue';
import DeliveryOrder from './components/DeliveryOrder.vue';

const loading = ref(false);
const { proxy } = getCurrentInstance();
const props = defineProps({
  id: String,
  type: String, // 1: 查看 2：送货
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

const formData = ref({});

const dataSource = reactive({
  goods: [],
  orders: [],
  isAdded: false, // 是否添加一个商品的送货单
  currentItems: {}, // 当前添加送货单的商品
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
  orderBiddingDetail(props.id)
    .then((res) => {
      Object.keys(formData.value).forEach((el) => {
        formData.value[el] = res[el] ?? undefined;
      });

      dataSource.goods = res.bidItems;

      orderDeliveryPage({ orderBiddingId: props.id }).then((orders) => {
        dataSource.orders = orders;
      });
    })
    .finally(() => {
      loading.value = false;
    });
};

const addOrder = (record) => {
  if (dataSource.isAdded) return;
  dataSource.isAdded = true;
  dataSource.currentItems = { deliveryItems: [{ bidItem: record }] };
};

// 提交保存
const submitLoading = ref(false);
const onFinish = () => {
  const { deliveryOrder } = proxy.$refs;
  deliveryOrder.validate().then((result) => {
    console.log(result);
    proxy.$confirm({
      content: '请确认是否提交送货单',
      onOk() {
        return new Promise((resolve, reject) => {
          submitLoading.value = true;
          orderDeliveryAdd({ ...result, orderBiddingId: props.id })
            .then(() => {
              proxy.$message.success('提交成功');
              proxy.$router.go(-1);
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
.operate_button {
  margin-top: 12px;
  margin-left: 33px;
  margin-bottom: 20px;
}
</style>
