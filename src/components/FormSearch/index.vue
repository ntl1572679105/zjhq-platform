<template>
  <div class="form-search">
    <div v-if="formItems && formItems.length > 0" class="table-page-search-wrapper">
      <a-form layout="inline" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row :gutter="24" class="form-row">
          <slot name="prefix"></slot>
          <a-col
            v-for="(item, index) in formItems"
            :key="index"
            :span="item.width || 8"
            class="form-col"
          >
            <a-form-item :key="index" :name="item.value" :label="item.label">
              <!-- 下拉 -->
              <a-select
                v-if="item.type === 'select'"
                v-model:value="form[item.value]"
                placeholder="请选择"
                :defaultValue="item.defaultValue"
                allowClear
                style="width: 100%"
                :options="item.options"
              />
              <!--文本-->
              <a-input
                v-if="item.type === 'text'"
                v-model:value="form[item.value]"
                placeholder="请输入"
                allowClear
              />
              <!--文本plus-->
              <a-select
                v-if="item.type === 'selectText'"
                v-model:value="form[item.value]"
                show-search
                optionFilterProp="label"
                placeholder="请选择"
                :options="item.options"
              />
              <!-- 级联 -->
              <a-cascader
                v-if="item.type === 'cascader'"
                v-model:value="form[item.value]"
                :options="item.options"
                placeholder="请选择"
                :change-on-select="item.changeOnSelect ?? false"
              />
              <!-- 级联 - 可选任一级 -->
              <a-cascader
                v-if="item.type === 'cascaderSelect'"
                v-model:value="form[item.value]"
                :options="item.options"
                placeholder="请选择"
                change-on-select
              />
              <a-date-picker
                v-if="item.type === 'datepicker'"
                v-model:value="form[item.value]"
                style="width: 100%"
                placeholder="请选择"
                :picker="item.picker || 'date'"
                @change="formatData"
                :options="item.options"
                :valueFormat="item.valueFormat || 'YYYY-MM-DD'"
              />
              <a-range-picker
                v-if="item.type === 'rangedatepicker'"
                style="width: 100%"
                v-model:value="form[item.value]"
                :format="item.format ?? 'YYYY/MM/DD'"
                :showTime="item.showTime ?? false"
              />
              <a-time-range-picker
                v-if="item.type === 'rangetimepicker'"
                style="width: 100%"
                v-model:value="form[item.value]"
                :format="item.format ?? 'HH:mm'"
              />
              <a-range-picker
                v-if="item.type === 'rangedatepickerdisabled'"
                style="width: 100%"
                v-model:value="form[item.value]"
                format="YYYY/MM/DD"
                :disabled-date="disabledDate"
              />
            </a-form-item>
          </a-col>
          <slot name="more"></slot>
          <a-col :span="buttonSpan" class="form-col">
            <a-space class="table-page-search-submitButtons">
              <a-button @click="clearData">重置</a-button>
              <a-button type="primary" @click="emit('searchForm', form)">查询</a-button>
            </a-space>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </div>
</template>
<script setup>
import dayjs from 'dayjs';
import { getCurrentInstance, reactive, defineProps, defineEmits, computed } from 'vue';

const { proxy } = getCurrentInstance();
defineProps({
  formItems: {
    // form查询项
    type: Array,
    default: () => [],
  },
  formData: {
    // form查询数据
    type: Object,
    default: () => {},
  },
  moreSpan: {
    type: Number,
    default: 0,
  },
  labelCol: {
    type: Object,
    default: () => ({ style: { width: '86px' } }),
  },
  wrapperCol: {
    type: Object,
    default: () => ({ style: { width: '100%' } }),
  },
});
const emit = defineEmits(['searchForm', 'clearForm', 'dateRangeChange']);

const form = reactive(JSON.parse(JSON.stringify(proxy.formData))); // form查询数据

const clearData = () => {
  // 清空搜索栏
  // Object.keys(form).forEach((key) => {
  //   form[key] = proxy.formData.key;
  // });
  Object.keys(proxy.formData).forEach((key) => {
    form[key] = proxy.formData.key;
  });
  emit('clearForm');
};
const formatData = (val) => {
  // console.log(dayjs(val).format('YYYY-MM-DD HH:MM'));
  // return dayjs(val, dateFormat);
};

const buttonSpan = computed(() => {
  let otherSpan = proxy.formItems.reduce((value, item) => {
    return value + (item.width || 8);
  }, 0);
  otherSpan += proxy.moreSpan || 0;
  const maxScale = Math.ceil(otherSpan / 24);
  const span = maxScale * 24 - otherSpan;
  if (span >= 4) {
    return span;
  }
  if (span === 0) {
    return 24;
  }
  return 8;
});

const disabledDate = (current) => {
  // Can not select days before today and today
  return current && current > dayjs().endOf('day');
};
</script>

<style scope lang="less">
.form-search {
  width: 100%;
  .a-select {
    width: 100%;
  }
  .form-row {
    margin-left: 0 !important;
    margin-right: 0 !important;
    width: 100%;
  }
  .form-col {
    padding-left: 16px !important;
    padding-right: 16px !important;
  }
}
</style>
