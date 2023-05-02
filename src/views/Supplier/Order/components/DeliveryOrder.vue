<template>
  <div>
    <CommonForm
      ref="infoForm"
      :canDisabled="canDisabled"
      :formItems="formItems"
      :formData="formData"
    />
    <a-table
      ref="table"
      size="default"
      row-key="productId"
      :columns="columns"
      :data-source="dataSource"
      :pagination="false"
      :scroll="{ x: 1080 }"
      style="padding: 0 13px 20px"
    >
      <template #bodyCell="{ column, index, record, text }">
        <template v-if="column.key === 'number'">
          <a-input-number
            :min="0"
            :disabled="canDisabled"
            v-model:value="record[column.dataIndex]"
            placeholder="请输入"
            style="width: 100%"
          ></a-input-number>
        </template>
        <template v-else-if="column.key === 'input'">
          <a-input
            :disabled="canDisabled"
            v-model:value="record[column.dataIndex]"
            :placeholder="canDisabled ? '-' : '请输入'"
          ></a-input>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup>
import CommonForm from '@/components/CommonForm/index.vue';
import { ref, getCurrentInstance } from 'vue';

const { proxy } = getCurrentInstance();
const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
  canDisabled: {
    type: Boolean,
    default: false,
  },
});

// 表单配置
const formItems = ref([
  {
    type: 'text',
    label: '送货单号',
    value: 'deliveryNo',
    rules: true,
  },
  {
    type: 'datepicker',
    label: '送货日期',
    value: 'deliveryTime',
    rules: true,
    valueFormat: 'YYYY-MM-DD',
    showTime: false,
  },
  // {
  //   type: 'number',
  //   label: '送货总数量',
  //   value: 'totalNumber',
  //   rules: true,
  // },
  // {
  //   type: 'number',
  //   label: '送货总金额(含税)',
  //   value: 'taxTotalAmount',
  //   rules: true,
  // },
  {
    type: 'text',
    label: '送货确认人',
    value: 'deliveryUser',
    rules: true,
  },
  {
    type: 'text',
    label: '联系方式',
    value: 'phone',
    rules: true,
  },
  {
    type: 'text',
    label: '收货人',
    value: 'deliveryReceiveUser',
    rules: true,
  },
  {
    type: 'text',
    label: '收货人电话',
    value: 'deliveryReceivePhone',
    rules: true,
  },
  {
    type: 'textarea',
    label: '备注',
    value: 'remark',
    rules: true,
  },
]);

const formData = ref(props.data);

const columns = [
  {
    title: '序号',
    customRender: ({ index }) => `${index + 1}`,
    width: 60,
  },
  // {
  //   title: '送货方式',
  //   dataIndex: 'deliveryType',
  //   key: 'input',
  //   width: 140,
  // },
  // {
  //   title: '送货单号',
  //   dataIndex: 'deliveryNo',
  //   key: 'input',
  //   width: 140,
  // },
  {
    title: '物料编码',
    dataIndex: ['bidItem', 'productId'],
    width: 200,
  },
  {
    title: '物料名称',
    dataIndex: ['bidItem', 'name'],
    width: 200,
    ellipsis: true,
  },
  {
    title: '物料品牌',
    dataIndex: ['bidItem', 'brand'],
    width: 120,
    ellipsis: true,
  },
  {
    title: '物料规格',
    customRender: ({ record }) =>
      record.bidItem.sku ? `${record.bidItem.sku.key}：${record.bidItem.sku.value}` : '',
    width: 200,
    ellipsis: true,
  },
  {
    title: '物料单位',
    dataIndex: ['bidItem', 'unit'],
    width: 120,
  },
  {
    title: '需求数量',
    dataIndex: ['bidItem', 'demand'],
    width: 120,
    ellipsis: true,
  },
  {
    title: '需求日期',
    dataIndex: ['bidItem', 'demandTime'],
    width: 140,
  },
  {
    title: '发货数量',
    dataIndex: 'deliveryNumber',
    key: 'number',
    width: 120,
  },
  // {
  //   title: '不含税收单价',
  //   dataIndex: 'referencePrice',
  //   key: 'number',
  //   width: 140,
  // },
  // {
  //   title: '税率',
  //   dataIndex: 'taxPrice',
  //   key: 'number',
  //   width: 120,
  // },
  // {
  //   title: '含税单价',
  //   dataIndex: 'taxAmount',
  //   key: 'number',
  //   width: 120,
  // },
  // {
  //   title: '收货人',
  //   dataIndex: 'receiveName',
  //   key: 'input',
  //   width: 140,
  // },
  // {
  //   title: '收货人电话',
  //   dataIndex: 'receivePhone',
  //   key: 'input',
  //   width: 140,
  // },
];

const dataSource = ref(props.data.deliveryItems);

const validateTable = () => {
  const keys = ['deliveryNumber'];
  return new Promise((resolve, reject) => {
    if (dataSource.value && dataSource.value.length > 0) {
      for (let i = 0; i < dataSource.value.length; i++) {
        const element = dataSource.value[i];
        for (let j = 0; j < keys.length; j++) {
          const value = element[keys[j]];
          const isEmpty = value == null || value === '';
          if (isEmpty) {
            console.log(`请完善送货信息-${keys[j]}-${value}`);
            proxy.$message.warning('请完善送货信息');
            reject();
            return;
          }
        }
      }
      resolve(dataSource.value);
    } else {
      proxy.$message.warning('送货不能为空');
      reject();
    }
  });
};

const validate = () => {
  return new Promise((resolve, reject) => {
    const { infoForm } = proxy.$refs;
    Promise.all([infoForm.validateFields(), validateTable()])
      .then((result) => {
        const info = result[0];
        const deliveryItemParams = result[1].map((item) => ({
          deliveryNumber: item.deliveryNumber,
          orderBiddingItemId: item.bidItem.id,
        }));
        resolve({ ...info, deliveryItemParams });
      })
      .catch(() => reject());
  });
};

defineExpose({
  validate,
});
</script>

<style lang="less" scoped></style>
