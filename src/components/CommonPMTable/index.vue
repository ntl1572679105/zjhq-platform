<template>
  <div class="common-sub-table">
    <alert style="margin-bottom: 17px" type="info" show-icon v-if="showAddButton">
      <template #message>
        已选择
        <span style="color: #1b77ff">{{ state.selectedRowKeys.length || 0 }}</span>
        项 <slot name="infoMore"></slot>
      </template>
      <template #closeText>
        <a-button type="text" size="small" @click.stop="canelSelects">清空</a-button>
      </template>
    </alert>
    <a-table
      :columns="columns"
      :dataSource="data"
      :row-key="rowKey"
      bordered
      :pagination="false"
      :scroll="scroll"
      :row-selection="
        showAddButton ? { selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange } : null
      "
    >
      <template #bodyCell="{ column, index, record, text }">
        <slot name="cell" :column="column" :record="record" :index="index" :text="text"></slot>
      </template>
    </a-table>
    <a-button type="dashed" v-if="showAddButton" class="table_button" @click="cellAdd"
      ><plus-outlined />{{ addButtonText }}</a-button
    >
  </div>
</template>
<script setup>
import { PlusOutlined } from '@ant-design/icons-vue';
import { Alert } from 'ant-design-vue';
import { reactive } from 'vue';

const props = defineProps({
  rowKey: {
    type: String,
    default: 'id',
  },
  columns: {
    type: Array,
    default: () => [],
  },
  data: {
    type: Array,
    default: () => [],
  },
  addButtonText: {
    type: String,
    default: '新增',
  },
  showAddButton: {
    type: Boolean,
    default: true,
  },
  scroll: {
    type: Object,
    default: () => {},
  },
});

const state = reactive({
  selectedRowKeys: [],
  // dataSource: props.data,
});

const onSelectChange = (selectedRowKeys, selectedRows) => {
  console.log(selectedRowKeys, selectedRows);
  state.selectedRowKeys = selectedRowKeys;
};

const emit = defineEmits(['cellAdd', 'cancelFinish', 'update:data']);

const canelSelects = () => {
  // 根据选择的selectedRowKeys
  const set = new Set(state.selectedRowKeys);
  // state.dataSource = state.dataSource.filter((item) => !set.has(item[props.rowKey]));
  // emit('cancelFinish', state.dataSource);
  emit(
    'update:data',
    props.data.filter((item) => !set.has(item[props.rowKey])),
  );
  state.selectedRowKeys = [];
};

const cellAdd = () => {
  emit('cellAdd');
};
</script>

<style lang="less" scoped>
.common-sub-table {
  padding: 1px 33px 24px;
  .table_button {
    width: 100%;
    margin: 16px 0 2px 0;
    color: #000000a6;
  }
}
</style>
