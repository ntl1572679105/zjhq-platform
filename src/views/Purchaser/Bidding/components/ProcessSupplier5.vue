<template>
  <div class="common-sub-table">
    <a-table
      :columns="columns"
      :dataSource="dataSource"
      row-key="bidSupplierId"
      bordered
      :pagination="false"
    >
      <template #bodyCell="{ column, record, index, text }">
        <template v-if="column.key === 'winRemark'">
          <a-input
            :disabled="showOperate"
            v-model:value="record.winRemark"
            :placeholder="canDisabled ? '-' : '请输入'"
          ></a-input>
        </template>
        <template v-else-if="column.key === 'winNotificationUrl'">
          <template v-if="canDisabled">
            <a
              v-if="record.winNotificationUrl && record.winNotificationUrl.length > 0"
              :href="record.winNotificationUrl[0].url"
              target="_blank"
              >{{ record.winNotificationUrl[0].name }}</a
            >
            <span v-else>无</span>
          </template>
          <a-upload
            v-else
            v-model:file-list="record.winNotificationUrl"
            :before-upload="beforeUpload"
            :customRequest="handleUpload"
            :disabled="showOperate"
            @remove="handleRemove($event, record)"
          >
            <a-button
              :loading="fileLoading"
              v-if="record.winNotificationUrl === undefined || record.winNotificationUrl.length < 1"
            >
              <upload-outlined></upload-outlined>
              上传附件
            </a-button>
          </a-upload>
        </template>
      </template>
    </a-table>

    <div class="bottom_box" v-if="!showOperate">
      <a-button type="primary" :loading="loading" class="table_button" @click="onFinish"
        >确定</a-button
      >
    </div>
  </div>
</template>

<script setup>
import { UploadOutlined } from '@ant-design/icons-vue';
import { ref, getCurrentInstance } from 'vue';
import { Upload } from '@/api/common';
import { bidSupplier } from '@/api/operator/bid.js';

const { proxy } = getCurrentInstance();
const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
});

const columns = [
  {
    title: '中标供应商',
    dataIndex: 'supplierName',
    width: '20%',
    align: 'center',
  },
  {
    title: '中标金额',
    dataIndex: 'quoteAmount',
    width: '20%',
    align: 'center',
  },
  {
    title: '中标通知书发出日期',
    dataIndex: 'winNotificationTime',
    width: '20%',
    align: 'center',
  },
  {
    title: '中标通知书',
    key: 'winNotificationUrl',
    width: '20%',
    align: 'center',
  },
  {
    title: '备注',
    key: 'winRemark',
    width: '20%',
    align: 'center',
  },
];

const dataSource = ref(
  props.data.map((item) => ({
    bidSupplierId: item.id,
    supplierName: item.supplierName,
    winNotificationUrl: item.winNotificationUrl
      ? [
          {
            status: 'done',
            url: item.winNotificationUrl,
            uid: new Date().getTime(),
            name: item.winNotificationUrl.split('/').pop(),
          },
        ]
      : [],
    winRemark: item.winRemark,
    quoteAmount: item.quoteAmount,
    winNotificationTime: item.winNotificationTime,
  })),
);

const showOperate = !!props.data[0].winNotificationTime;

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
  record.winNotificationUrl = [];
};

const fileLoading = ref(false);
const handleUpload = ({ file, onSuccess, onError }) => {
  const formData = new FormData();
  formData.append('file', file);
  fileLoading.value = true;
  Upload(formData)
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

const emits = defineEmits(['finish']);
const loading = ref(false);
const onFinish = () => {
  validate().then((res) => {
    const calibrateParamList = [];
    res.forEach((item) => {
      const temp = {
        bidSupplierId: item.bidSupplierId,
        winRemark: item.winRemark,
        winNotificationUrl: undefined,
      };
      if (Array.isArray(item.winNotificationUrl) && item.winNotificationUrl.length > 0) {
        temp.winNotificationUrl = item.winNotificationUrl[0].url;
      }
      calibrateParamList.push(temp);
    });
    loading.value = true;
    bidSupplier(calibrateParamList)
      .then(() => {
        proxy.$message.success('中标通知书完成');
        emits('finish');
      })
      .finally(() => {
        loading.value = false;
      });
  });
};

const validate = () => {
  const keys = ['winNotificationUrl', 'winRemark'];
  return new Promise((resolve, reject) => {
    if (dataSource.value && dataSource.value.length > 0) {
      for (let i = 0; i < dataSource.value.length; i++) {
        const element = dataSource.value[i];
        for (let j = 0; j < keys.length; j++) {
          const value = element[keys[j]];
          if (!value || value.length <= 0) {
            console.log(`请完善定标信息-${keys[j]}-${value}`);
            proxy.$message.warning('请完善定标信息');
            reject();
            return;
          }
        }
      }
      resolve([...dataSource.value]);
    } else {
      proxy.$message.warning('定标信息不能为空');
      reject();
    }
  });
};

defineExpose({
  validate,
});
</script>

<style lang="less" scoped>
.common-sub-table {
  padding: 1px 33px 24px;
  .bottom_box {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 16px 0 2px 0;
  }
  .table_button {
    width: 240px;
  }
}
</style>
