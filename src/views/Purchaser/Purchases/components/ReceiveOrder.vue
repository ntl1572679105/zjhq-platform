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
        <template v-if="column.key === 'receiveNumber'">
          <a-input-number
            :min="0"
            :disabled="canDisabled"
            v-model:value="record.bidItem.receiveNumber"
            placeholder="请输入"
            style="width: 100%"
          ></a-input-number>
        </template>
      </template>
    </a-table>

    <a-table
      ref="table2"
      size="default"
      row-key="id"
      :columns="columns2"
      :data-source="dataSource2"
      :pagination="false"
      style="padding: 0 13px 20px"
    >
      <template #bodyCell="{ column, index, record, text }">
        <template v-if="column.key === 'input'">
          <a-input
            :disabled="canDisabled"
            v-model:value="record[column.dataIndex]"
            :placeholder="canDisabled ? '-' : '请输入'"
          ></a-input>
        </template>
        <template v-else-if="column.key === 'score'">
          <a-rate v-model:value="record.score" :disabled="canDisabled" />
        </template>
        <template v-else-if="column.key === 'file'">
          <template v-if="canDisabled">
            <a
              v-if="record.attachmentUrls && record.attachmentUrls.length > 0"
              :href="record.attachmentUrls[0].url"
              target="_blank"
              >{{ record.attachmentUrls[0].name }}</a
            >
            <span v-else>无</span>
          </template>
          <a-upload
            v-else
            v-model:file-list="record.attachmentUrls"
            :before-upload="beforeUpload"
            :customRequest="handleUpload"
            :disabled="canDisabled"
            @remove="handleRemove($event, record)"
          >
            <a-button
              :loading="fileLoading"
              v-if="!(record.attachmentUrls && record.attachmentUrls.length > 0)"
            >
              <upload-outlined></upload-outlined>
              上传附件
            </a-button>
          </a-upload>
        </template>
      </template>
    </a-table>

    <div v-if="!canDisabled" class="flex-center">
      <a-button class="submit-button" :loading="submitLoading" @click="onFinish" type="primary"
        >确认收货</a-button
      >
    </div>
  </div>
</template>

<script setup>
import CommonForm from '@/components/CommonForm/index.vue';
import { ref, getCurrentInstance } from 'vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import { Upload } from '@/api/common';
import { receiveOrder } from '@/api/operator/order.js';

const { proxy } = getCurrentInstance();

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});

// 0-未送货 1-已送货 2-已收货 3-有拒收
const canDisabled = props.data.deliveryItems[0].bidItem.logisticsStatus === 2;

// 表单配置
const formItems = ref([
  {
    type: 'text',
    label: '收货单号',
    value: 'deliveryNo',
    rules: true,
    disabled: true,
  },
  {
    type: 'datepicker',
    label: '收货日期',
    value: 'receiveTime',
    rules: true,
    valueFormat: 'YYYY-MM-DD',
    showTime: false,
  },
  // {
  //   type: 'number',
  //   label: '收货总数量',
  //   value: 'totalNumber',
  //   rules: true,
  // },
  // {
  //   type: 'number',
  //   label: '收货总金额(含税)',
  //   value: 'taxTotalAmount',
  //   rules: true,
  // },
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
    type: 'text',
    label: '收货确认人',
    value: 'receiveUser',
    rules: true,
  },
  {
    type: 'text',
    label: '收货确认人电话',
    value: 'receivePhone',
    rules: true,
  },
  {
    type: 'textarea',
    label: '备注',
    value: 'receiveRemark',
    rules: true,
  },
]);

const formData = ref(props.data);
const dataSource = ref(props.data.deliveryItems);
const dataSource2 = ref(
  canDisabled
    ? props.data.orderComments.map((item) => ({
        ...item,
        attachmentUrls:
          item.attachmentUrls && item.attachmentUrls.length > 0
            ? [
                {
                  status: 'done',
                  url: item.attachmentUrls[0],
                  uid: new Date().getTime(),
                  name: item.attachmentUrls[0].split('/').pop(),
                },
              ]
            : [],
      }))
    : [
        { type: '平台', score: 5, attachmentUrls: [], content: '' },
        { type: '供应商', score: 5, attachmentUrls: [], content: '' },
        {
          type: props.data.deliveryItems[0].bidItem.name,
          score: 5,
          attachmentUrls: [],
          content: '',
        },
      ],
);

const columns = [
  {
    title: '序号',
    customRender: ({ index }) => `${index + 1}`,
    width: 60,
  },
  // {
  //   title: '收货方式',
  //   dataIndex: 'deliveryType',
  //   key: 'input',
  //   width: 140,
  // },
  // {
  //   title: '收货单号',
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
  },
  {
    title: '需求日期',
    dataIndex: ['bidItem', 'demandTime'],
    width: 140,
  },
  // {
  //   title: '发货数量',
  //   dataIndex: 'deliveryNumber',
  //   key: 'number',
  //   width: 120,
  // },
  // {
  //   title: '拒收数量',
  //   dataIndex: 'deliveryNumber',
  //   key: 'number',
  //   width: 120,
  // },
  // {
  //   title: '拒收原因',
  //   dataIndex: 'deliveryNumber',
  //   key: 'input',
  //   width: 120,
  // },
  {
    title: '收货数量',
    // dataIndex: ['bidItem', 'receiveNumber'],
    key: 'receiveNumber',
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
  //   dataIndex: 'name',
  //   key: 'input',
  //   width: 140,
  // },
  // {
  //   title: '收货人电话',
  //   dataIndex: 'phone',
  //   key: 'input',
  //   width: 140,
  // },
];

const columns2 = [
  {
    title: '评价',
    dataIndex: 'type',
    width: 140,
  },
  {
    title: '评价星级',
    key: 'score',
    width: 240,
  },
  {
    title: '评价内容',
    dataIndex: 'content',
    key: 'input',
    ellipsis: true,
  },
  {
    title: '附件',
    key: 'file',
    ellipsis: true,
    width: 200,
  },
];

// 文件上传
const beforeUpload = (file) => {
  const maxSize = 10 * 1024 * 1024; // 10M
  if (file.size > maxSize) {
    proxy.$message.error('文件限制大小10M以下');
    return false;
  }
  return true;
};

const handleRemove = (file, record) => {
  record.attachmentUrls = [];
};

const fileLoading = ref(false);
const handleUpload = ({ file, onSuccess, onError }) => {
  const data = new FormData();
  data.append('file', file);
  fileLoading.value = true;
  Upload(data)
    .then((res) => {
      file.url = res.url;
      fileLoading.value = false;
      onSuccess();
    })
    .catch(() => {
      onError();
      fileLoading.value = false;
      handleRemove(file);
      proxy.$message.error('文件上传失败，请重试');
    });
};

// 校验
const validateTable1 = () => {
  const keys = [['bidItem', 'receiveNumber']];
  return new Promise((resolve, reject) => {
    if (dataSource.value && dataSource.value.length > 0) {
      for (let i = 0; i < dataSource.value.length; i++) {
        const element = dataSource.value[i];
        for (let j = 0; j < keys.length; j++) {
          // const value = element[keys[j]];
          const value = element.bidItem.receiveNumber;
          const isEmpty = value == null || value === '';
          if (isEmpty) {
            console.log(`请完善收货信息-${keys[j]}-${value}`);
            proxy.$message.warning('请完善收货信息');
            reject();
            return;
          }
        }
      }
      resolve(dataSource.value);
    } else {
      proxy.$message.warning('收货不能为空');
      reject();
    }
  });
};

const validateTable2 = () => {
  const keys = ['score', 'content'];
  return new Promise((resolve, reject) => {
    if (dataSource2.value && dataSource2.value.length > 0) {
      for (let i = 0; i < dataSource2.value.length; i++) {
        const element = dataSource2.value[i];
        for (let j = 0; j < keys.length; j++) {
          const value = element[keys[j]];
          const isEmpty = value == null || value === '';
          if (isEmpty) {
            console.log(`请完善评价信息-${keys[j]}-${value}`);
            proxy.$message.warning('请完善评价信息');
            reject();
            return;
          }
        }
      }
      resolve(dataSource2.value);
    } else {
      proxy.$message.warning('评价不能为空');
      reject();
    }
  });
};

const emits = defineEmits(['finish']);

// 提交保存
const submitLoading = ref(false);
const onFinish = () => {
  const { infoForm } = proxy.$refs;
  Promise.all([infoForm.validateFields(), validateTable1(), validateTable2()]).then((result) => {
    proxy.$confirm({
      content: '请确认是否提交收货单',
      onOk() {
        return new Promise((resolve, reject) => {
          const info = result[0];
          const deliveryItemParams = result[1].map((item) => ({
            // receiveNum: item['bidItem,receiveNumber'],
            receiveNum: item.bidItem.receiveNumber,
            orderDeliveryItemId: item.bidItem.id,
          }));
          const commentParams = result[2];
          commentParams.forEach((item) => {
            item.orderBiddingItemId = props.data.deliveryItems[0].orderBiddingItemId;
            if (Array.isArray(item.attachmentUrls) && item.attachmentUrls.length > 0) {
              item.attachmentUrls = [item.attachmentUrls[0].url];
            } else {
              item.attachmentUrls = undefined;
            }
          });
          const params = {
            ...info,
            deliveryItemParams,
            commentParams,
            orderDeliveryId: props.data.id,
          };
          console.log(params);
          submitLoading.value = true;
          receiveOrder(params)
            .then(() => {
              resolve();
              proxy.$message.success('提交成功');
              emits('finish');
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
.submit-button {
  margin: 0 auto 20px;
  width: 240px;
}
</style>
