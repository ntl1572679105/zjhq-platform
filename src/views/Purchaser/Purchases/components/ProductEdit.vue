<template>
  <a-skeleton active :loading="loading">
    <CommonPMTable
      :columns="columns"
      rowKey="pid"
      v-model:data="dataSource"
      addButtonText="新增商品"
      @cellAdd="addProduct"
      :scroll="{ x: 1600 }"
      :showAddButton="!canDisabled"
    >
      <template #cell="{ column, record, index, text }">
        <template v-if="column.key === 'productId'">
          <a-select
            v-model:value="record.productId"
            :options="productState.list"
            :disabled="canDisabled"
            style="width: 100%"
            placeholder="请选择"
            @change="(value, selectedOption) => productChange(value, selectedOption, record)"
          />
        </template>
        <template v-else-if="column.key === 'skuId'">
          <a-select
            v-model:value="record.skuId"
            :options="productState.skus"
            :disabled="canDisabled"
            style="width: 100%"
            placeholder="请选择"
            @change="(value, selectedOption) => skuChange(value, selectedOption, record)"
          />
        </template>
        <template v-else-if="column.key === 'demand'">
          <a-input-number
            :min="0"
            :disabled="canDisabled"
            v-model:value="record.demand"
            placeholder="请输入"
            style="width: 100%"
          >
          </a-input-number>
        </template>
        <template v-else-if="column.key === 'demandTime'">
          <a-date-picker
            v-model:value="record.demandTime"
            style="width: 100%"
            placeholder="请选择"
            :disabled="canDisabled"
            valueFormat="YYYY-MM-DD"
          />
        </template>
      </template>
    </CommonPMTable>
  </a-skeleton>
</template>

<script setup>
import CommonPMTable from '@/components/CommonPMTable/index.vue';
import { ref, getCurrentInstance, onMounted, reactive, watch } from 'vue';
import { productList } from '@/api/common';

const { proxy } = getCurrentInstance();
const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  canDisabled: {
    type: Boolean,
    default: false,
  },
  // 一级类目id，必有
  categoryId: {
    type: String,
    required: true,
  },
});

watch(
  () => props.categoryId,
  (value) => {
    dataSource.value = [];
    getProductList();
  },
);

const columns = [
  {
    title: '序号',
    customRender: ({ index }) => `${index + 1}`,
    width: 60,
  },
  {
    title: '物料编码',
    dataIndex: 'pid',
    width: 200,
  },
  {
    title: '物料名称',
    key: 'productId',
    width: 200,
  },
  {
    title: '物料品牌',
    dataIndex: 'brand',
    width: 120,
  },
  {
    title: '物料规格',
    key: 'skuId',
    width: 200,
  },
  {
    title: '物料单位',
    dataIndex: 'unit',
    width: 120,
  },
  {
    title: '需求数量',
    key: 'demand',
    width: 160,
  },
  {
    title: '需求日期',
    key: 'demandTime',
    width: 200,
  },
  {
    title: '历史价格',
    dataIndex: 'historyPrice',
    width: 120,
  },
  {
    title: '含税价格',
    dataIndex: 'taxPrice',
    width: 120,
  },
];

const dataSource = ref(
  props.data.map((item) => ({
    pid: item.id,
    productId: item.name,
    skuId: item.sku ? `${item.sku.key}：${item.sku.value}` : '',
    brand: item.brand,
    unit: item.unit,
    demand: item.demand,
    demandTime: item.demandTime,
    taxPrice: item.referencePrice,
  })),
);

// 该商品下类目信息
const loading = ref(false);
onMounted(() => {
  if (!props.canDisabled) {
    getProductList();
  }
});

// 部门数据
const productState = reactive({
  list: [],
  skus: [],
});
const getProductList = () => {
  loading.value = true;
  productList(props.categoryId)
    .then((res) => {
      productState.list = res.map((item) => ({ label: item.name, value: item.id, ...item }));

      //   dataSource.value = props.data.map((item) => {
      //     return { ...item, pid: item.productId };
      //   });
    })
    .finally(() => {
      loading.value = false;
    });
};

const productChange = (value, selectedOption, record) => {
  console.log(value, selectedOption);
  if (value) {
    record.pid = value;
    record.brand = selectedOption.brand;
    record.unit = selectedOption.unit;
    productState.skus = selectedOption.skus.map((item) => ({
      label: `${item.sku.key}：${item.sku.value}`,
      value: item.id,
      taxPrice: item.taxPrice,
    }));
  } else {
    record.pid = new Date().getTime();
    record.brand = '';
    record.unit = '';
    productState.skus = [];
  }
};

const skuChange = (value, selectedOption, record) => {
  console.log(value, selectedOption);
  if (value) {
    record.taxPrice = selectedOption.taxPrice;
  } else {
    record.taxPrice = '';
  }
};

// 添加一列/删除
const addProduct = () => {
  dataSource.value.push({
    pid: new Date().getTime(),
    productId: undefined,
    brand: '',
    skuId: undefined,
    unit: '',
    demand: '',
    demandTime: undefined,
    taxPrice: '',
  });
};

const validate = () => {
  const keys = ['productId', 'skuId', 'demand', 'demandTime'];
  return new Promise((resolve, reject) => {
    if (dataSource.value && dataSource.value.length > 0) {
      for (let i = 0; i < dataSource.value.length; i++) {
        const element = dataSource.value[i];
        for (let j = 0; j < keys.length; j++) {
          const value = element[keys[j]];
          if (!value) {
            console.log(`请完善商品信息-${keys[j]}-${value}`);
            proxy.$message.warning('请完善商品信息');
            reject();
            return;
          }
        }
      }
      resolve(dataSource.value);
    } else {
      proxy.$message.warning('商品不能为空');
      reject();
    }
  });
};

defineExpose({
  validate,
});
</script>

<style lang="less" scoped></style>
