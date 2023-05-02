<template>
  <CommonPMTable
    :columns="columns"
    rowKey="id"
    v-model:data="dataSource"
    addButtonText="新增资质"
    @cellAdd="skuAdd"
    style="width: 100%; padding: 0 30px 30px 30px"
    :showAddButton="!canDisabled"
  >
    <template #cell="{ column, index, record, text }">
      <template v-if="column.key === 'input'">
        <a-input
          :disabled="canDisabled"
          :placeholder="canDisabled ? '-' : '请输入'"
          v-model:value="record[column.dataIndex]"
        />
      </template>
      <template v-else-if="column.key === 'datepicker'">
        <a-date-picker
          v-model:value="record[column.dataIndex]"
          style="width: 100%"
          :disabled="canDisabled"
          valueFormat="YYYY-MM-DD"
        />
      </template>
      <template v-else-if="column.key === 'file'">
        <template v-if="canDisabled">
          <a
            v-if="record[column.dataIndex] && record[column.dataIndex].length > 0"
            :href="record[column.dataIndex][0].url"
            target="_blank"
            >{{ record[column.dataIndex][0].name }}</a
          >
          <span v-else>无</span>
        </template>
        <a-upload
          v-else
          v-model:file-list="record[column.dataIndex]"
          :before-upload="beforeUpload"
          :customRequest="handleUpload"
          @remove="handleRemove($event, record, column.dataIndex)"
          :disabled="canDisabled"
        >
          <a-button
            :loading="fileLoading"
            v-if="record[column.dataIndex] === undefined || record[column.dataIndex].length < 1"
          >
            <upload-outlined></upload-outlined>
            上传附件
          </a-button>
        </a-upload>
      </template>
    </template>
  </CommonPMTable>
</template>

<script setup>
import CommonPMTable from '@/components/CommonPMTable/index.vue';
import { ref, getCurrentInstance, onMounted, reactive, watch } from 'vue';
import { Upload } from '@/api/common';

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
});

const columns = [
  {
    title: '资质名称',
    dataIndex: 'name',
    key: 'input',
  },
  {
    title: '资质有效期起',
    dataIndex: 'validBeginTime',
    key: 'datepicker',
  },
  {
    title: '资质有效期止',
    dataIndex: 'validEndTime',
    key: 'datepicker',
  },
  {
    title: '资质证件',
    dataIndex: 'url',
    key: 'file',
    ellipsis: true,
  },
  {
    title: '生产许可',
    dataIndex: 'productionCertificate',
    key: 'file',
    ellipsis: true,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'input',
  },
];

const dataSource = ref(props.data);

// 添加一列/删除
const skuAdd = () => {
  dataSource.value.push({
    id: new Date().getTime(),
    name: '',
    validBeginTime: '',
    validEndTime: '',
    url: [],
    productionCertificate: [],
    remark: '',
  });
};

// 文件上传
const beforeUpload = (file) => {
  const maxSize = 10 * 1024 * 1024; // 10M
  if (file.size > maxSize) {
    proxy.$message.error('文件限制大小10M以下');
    return false;
  }
  return true;
};

const handleRemove = (file, record, key) => {
  record[key] = [];
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

const validate = () => {
  const keys = ['name', 'validBeginTime', 'validEndTime', 'url'];
  // remark、attachmentUrlList
  return new Promise((resolve, reject) => {
    if (dataSource.value && dataSource.value.length > 0) {
      for (let i = 0; i < dataSource.value.length; i++) {
        const element = dataSource.value[i];
        for (let j = 0; j < keys.length; j++) {
          const value = element[keys[j]];
          if (!value) {
            console.log(`资质信息-${keys[j]}-${value}`);
            proxy.$message.warning('请完善资质信息');
            reject();
            return;
          }
        }
      }
      resolve(dataSource.value);
    } else {
      proxy.$message.warning('资质不能为空');
      reject();
    }
  });
};

defineExpose({
  validate,
});
</script>

<style lang="less" scoped></style>
