<template>
  <div class="common-sub-table">
    <alert
      v-if="rowSelection.selectedRowKeys.length"
      style="margin-bottom: 17px"
      type="info"
      show-icon
      close-text="清空"
    >
      <template #message>
        已选择
        <span style="color: #1b77ff">{{ rowSelection.selectedRowKeys.length || 0 }}</span>
        项&emsp;&emsp;服务调用总计: {{ dataSource.alertAmount }} 万
      </template>
    </alert>
    <a-table
      :columns="columns"
      :dataSource="dataSource"
      :row-key="rowKey"
      bordered
      :row-selection="rowSelection"
    >
      <template #bodyCell="{ column, index, record, text }">
        <template v-if="column.key === 'input'">
          <a-input v-if="editKey" placeholder="请输入" v-model:value="record[column.dataIndex]" />
          <span v-else>{{ text }}</span>
        </template>
        <template v-else-if="column.key === 'select'">
          <a-select
            v-if="editKey"
            v-model:value="record[column.dataIndex]"
            placeholder="请选择"
            :options="column.options"
            style="width: 150px"
          >
          </a-select>
          <span v-else>{{ text }}</span>
        </template>
        <template v-else-if="column.key === 'datepicker'">
          <a-date-picker
            v-if="editKey"
            style="width: 100%"
            v-model:value="record[column.dataIndex]"
            placeholder="选择日期"
          />
          <span v-else>{{ text }}</span>
        </template>
        <template v-if="column.key === 'file'">
          <a-upload
            v-if="editKey"
            v-model:file-list="record.url"
            :customRequest="handleFile"
            class="avatar-uploader"
            :data="{ index: index }"
            :before-upload="beforeUpload"
            @preview="handlePreview"
            @remove="handleFileRemove(record)"
          >
            <a-button class="c-0025" v-if="!record.url || record.url.length < 1">
              上传证件
              <upload-outlined></upload-outlined>
            </a-button>
            <a-button v-else>
              证件已上传
              <upload-outlined></upload-outlined>
            </a-button>
          </a-upload>
          <a-button v-else>
            证件已上传
            <upload-outlined></upload-outlined>
          </a-button>
        </template>
        <slot name="cell" :column="column" :record="record" :index="index" :text="text"></slot>
      </template>
    </a-table>
    <a-button type="dashed" v-if="showBtn" class="table_button" @click="cellAdd"
      ><plus-outlined />{{ addButtonText }}</a-button
    >
  </div>
</template>
<script setup>
import { PlusOutlined } from '@ant-design/icons-vue';
import dayjs from 'dayjs';
import { defineProps, computed, defineEmits, toRefs } from 'vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import { Upload } from '@/api/common.js';
import { Alert, message } from 'ant-design-vue';

const props = defineProps({
  // table 列表row-key
  rowKey: {
    type: String,
    default: 'id',
  },
  columns: {
    // form查询数据
    type: Array,
    default: [],
  },
  dataSource: {
    type: Array,
    default: [],
  },
  addButtonText: {
    type: String,
    default: '新增',
  },
  rowSelection: {
    type: Object,
    default: {},
  },
  editKey: {
    type: Boolean,
    default: false,
  },
  showBtn: {
    type: Boolean,
    default: false,
  },
});

const { dataSource, rowSelection } = toRefs(props);

// 添加资质证件逻辑
const handleFile = (info) => {
  console.log(info);
  if (!info) return;
  const { file, data } = info;
  // data: {index: 0, type: 1}
  // 组装数据
  const formData = new FormData();
  formData.append('file', file);

  Upload(formData)
    .then((res) => {
      console.log(res);
      dataSource.value[data.index].file = [
        {
          status: 'done',
          url: res.url,
          name: res.originalName,
        },
      ];
    })
    .catch((error) => {
      console.log(error);
      handleFileRemove(file);
      message.warning('上传失败');
    });
};

const handleFileRemove = (record) => {
  record.file = [];
};

// 性别
const sexText = computed(() => {
  return (value) => {
    // 0-未知 1-女 2-男
    if (value === null) return '未知';
    return ['未知', '女', '男'][value];
  };
});

// 金额
const totalAmount = computed(() => {
  return (values) => {
    return values ? `￥${Number(values).toFixed(2)}` : '￥0';
  };
});

const emit = defineEmits(['cellAdd']);

const cellAdd = () => {
  emit('cellAdd');
};
</script>

<style lang="less" scoped>
.common-sub-table {
  padding: 1px 33px;
  .table_button {
    width: 100%;
    margin: 16px 0 24px 0;
    color: #000000a6;
  }
}
</style>
