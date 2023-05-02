<template>
  <div v-if="formItems && formItems.length > 0" class="common-form">
    <a-form
      layout="vertical"
      :model="form"
      :rules="rules"
      :ref="formRef"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
    >
      <a-row :gutter="24" class="form-row">
        <a-col
          v-for="(item, index) in formItems"
          :key="index"
          :span="item.width || 8"
          :style="{ display: item.hidden ? 'none' : 'block' }"
        >
          <a-form-item
            v-if="item.value && item.type"
            :key="index"
            :name="item.value"
            :label="item.label"
          >
            <a-select
              v-if="item.type === 'select'"
              v-model:value="form[item.value]"
              :placeholder="item.placeholder || '请选择'"
              allowClear
              :options="item.options"
              :mode="item.mode ?? '-'"
              @change="changeSelect"
              :disabled="canDisabled"
            >
            </a-select>
            <a-input
              v-else-if="item.type === 'text'"
              v-model:value="form[item.value]"
              :placeholder="item.placeholder || (canDisabled ? '-' : '请输入')"
              allowClear
              :disabled="canDisabled || item.disabled"
            />
            <a-input-number
              v-else-if="item.type === 'number'"
              v-model:value="form[item.value]"
              :placeholder="item.placeholder || '请输入'"
              :min="item.min ?? 1"
              :max="item.max"
              :precision="item.precision ?? 0"
              style="width: 100%"
              :disabled="canDisabled"
            />
            <a-textarea
              v-else-if="item.type === 'textarea'"
              v-model:value="form[item.value]"
              :rows="item.rows || 4"
              :placeholder="item.placeholder || (canDisabled ? '-' : '请输入')"
              :maxlength="item.maxlength || 300"
              :disabled="canDisabled"
            />
            <a-cascader
              v-else-if="item.type === 'cascader'"
              v-model:value="form[item.value]"
              :options="item.options"
              :placeholder="item.placeholder || '请选择'"
              :disabled="canDisabled"
              :change-on-select="item.changeOnSelect ?? false"
            />
            <a-date-picker
              v-else-if="item.type === 'datepicker'"
              v-model:value="form[item.value]"
              style="width: 100%"
              :picker="item.picker || 'date'"
              :showTime="item.showTime ?? false"
              :placeholder="item.placeholder || '请选择'"
              :valueFormat="item.valueFormat"
              @change="changeDate"
              :disabled="canDisabled"
            />
            <a-range-picker
              v-else-if="item.type === 'rangedatepicker'"
              style="width: 100%"
              v-model:value="form[item.value]"
              :format="item.format ?? 'YYYY/MM/DD'"
              :showTime="item.showTime ?? false"
              :valueFormat="item.valueFormat"
              :placeholder="item.placeholder"
              :disabled="canDisabled"
            />
            <a-upload
              v-else-if="item.type === 'file'"
              v-model:file-list="form[item.value]"
              :before-upload="beforeUpload"
              :customRequest="handleUpload"
              @remove="handleRemove($event, item.value)"
              :disabled="canDisabled"
            >
              <a-button
                :loading="fileLoading"
                v-if="form[item.value] === undefined || form[item.value].length < 1"
              >
                <upload-outlined></upload-outlined>
                {{ item.placeholder || '上传附件' }}
              </a-button>
            </a-upload>
            <a-radio-group
              v-else-if="item.type === 'radio-group'"
              v-model:value="form[item.value]"
              :disabled="canDisabled"
              :options="item.options"
            >
            </a-radio-group>
          </a-form-item>
        </a-col>
        <slot name="more"></slot>
      </a-row>
    </a-form>
  </div>
</template>
<script setup>
import { getCurrentInstance, reactive, defineEmits, onMounted, ref } from 'vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import { Upload } from '@/api/common';

const { proxy } = getCurrentInstance();
const props = defineProps({
  formItems: {
    type: Array,
    required: true,
    default: () => [],
  },
  formData: {
    type: Object,
    default: () => {},
  },
  formRef: {
    type: String,
    default: 'formRef',
  },
  labelCol: {
    type: Object,
    default: () => ({ style: { width: '100%' } }),
  },
  wrapperCol: {
    type: Object,
    default: () => ({ style: { width: '100%' } }),
  },
  // 表单是否可以编辑
  canDisabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['dateChange', 'selectChange']);

const form = reactive(JSON.parse(JSON.stringify(props.formData)));

// rules 通过formItems获取
const rules = ref(null);
onMounted(() => {
  const temps = {};
  props.formItems.forEach((item) => {
    if (typeof item.rules === 'boolean' && item.rules === true) {
      temps[item.value] = [
        { required: true, message: getRuleDefaultMessage(item), trigger: 'change' },
      ];
    } else if (item.rules) {
      temps[item.value] = item.rules;
    }
  });
  rules.value = temps;
});

const resetRules = () => {
  console.log(props.formItems);
  const temps = {};
  props.formItems.forEach((item) => {
    if (item.hidden === true) {
      console.log(item);
    } else if (typeof item.rules === 'boolean' && item.rules === true) {
      temps[item.value] = [
        { required: true, message: getRuleDefaultMessage(item), trigger: 'change' },
      ];
    } else if (item.rules) {
      temps[item.value] = item.rules;
    }
  });
  rules.value = temps;
};

const getRuleDefaultMessage = (item) => {
  if (item.placeholder) {
    return item.placeholder;
  }
  switch (item.type) {
    case 'select':
    case 'cascader':
    case 'datepicker':
    case 'rangedatepicker':
      return `请选择${item.label}`;
    default:
      return `请输入${item.label}`;
  }
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

const handleRemove = (file, key) => {
  form[key] = [];
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

// 操作事件
const changeDate = (val) => {
  emit('dateChange', val);
};

const changeSelect = (value, option) => {
  if (option && option.key) {
    emit('selectChange', { value, option });
  }
};

const validateFields = (isneed = true) => {
  return proxy.$refs[props.formRef].validate();
};

defineExpose({
  validateFields,
  resetRules,
});
</script>

<style scope lang="less">
.common-form {
  padding: 0 20px;
}
.form-row {
  margin-left: 0 !important;
  margin-right: 0 !important;
  width: 100%;
}
.ant-radio-wrapper {
  display: flex !important;
  height: 30px !important;
  line-height: 30px !important;
}
</style>
