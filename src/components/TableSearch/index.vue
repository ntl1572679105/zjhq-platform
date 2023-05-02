<template>
  <a-card :bordered="false">
    <FormSearch
      :formItems="formItems"
      :formData="formData"
      @searchForm="searchForm"
      @clearForm="clearForm"
    ></FormSearch>
    <slot name="action"></slot>
    <CommonTable
      ref="tableRef"
      :columns="columns"
      :rowKey="rowKey"
      :scroll="scroll"
      :api="api"
      :params="dataSource.params"
      :rowSelection="rowSelection"
    >
      <template #cell="{ column, record, index, text }">
        <slot name="cell" :column="column" :record="record" :index="index" :text="text"></slot>
      </template>
    </CommonTable>
  </a-card>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import FormSearch from '@/components/FormSearch/index.vue';
import CommonTable from '@/components/CommonTable/index.vue';

// form search
const props = defineProps({
  formItems: {
    type: Array,
    default: () => [],
  },
  formData: {
    type: Object,
    default: () => {},
  },
  columns: {
    type: Array,
    required: true,
  },
  api: {
    type: Function,
    required: true,
  },
  rowKey: String,
  scroll: Object,
  // 对参数自定义
  setupParams: Function,
  // 可选列表
  rowSelection: {
    type: Object,
    default: null,
  },
});

const tableRef = ref(null);
const dataSource = reactive({
  params: props.formData,
});

const searchForm = (formData) => {
  // 对原params赋值查询
  Object.keys(dataSource.params).forEach((key) => {
    dataSource.params[key] = formData[key] ?? undefined;
  });
  // 对特殊类型如时间区间等做自定义闭包赋值
  if (props.setupParams) {
    const temp = props.setupParams(formData);
    Object.keys(temp).forEach((key) => {
      dataSource.params[key] = temp[key] ?? undefined;
    });
  }
  // 查询列表
  tableRef.value.tableReset();
};

const clearForm = () => {
  searchForm({});
};

const refresh = () => {
  tableRef.value.tableSearch();
};

defineExpose({
  refresh,
});
</script>

<style lang="less" scoped></style>
