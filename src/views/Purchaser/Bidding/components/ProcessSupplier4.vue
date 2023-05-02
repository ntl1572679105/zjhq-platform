<template>
  <div class="common-sub-table">
    <a-table
      :columns="columns"
      :dataSource="data"
      row-key="id"
      bordered
      :pagination="false"
      :row-selection="
        showOperate ? { selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange } : null
      "
    >
    </a-table>

    <div v-if="showOperate" class="bottom_box">
      <a-button type="primary" :loading="state.loading" class="table_button" @click="onFinish"
        >选定</a-button
      >
    </div>
  </div>
</template>
<script setup>
import { getCurrentInstance, reactive } from 'vue';
import { bidSelect } from '@/api/operator/bid.js';

const { proxy } = getCurrentInstance();

defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  showOperate: {
    type: Boolean,
    default: true,
  },
});

const columns = [
  {
    title: '投标供应商',
    dataIndex: 'supplierName',
    width: '40%',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '评分',
    dataIndex: 'totalScore',
    width: '30%',
    align: 'center',
  },
  {
    title: '评分建议',
    dataIndex: 'totalSuggest',
    width: '30%',
    ellipsis: true,
    align: 'center',
  },
];

const state = reactive({
  selectedRowKeys: [],
  loading: false,
});

const onSelectChange = (selectedRowKeys, selectedRows) => {
  console.log(selectedRowKeys, selectedRows);
  state.selectedRowKeys = selectedRowKeys;
};

const emit = defineEmits(['finish']);

const onFinish = () => {
  if (state.selectedRowKeys <= 0) {
    proxy.$message.warning('请选择供应商');
  } else {
    state.loading = true;
    bidSelect({ idList: state.selectedRowKeys })
      .then(() => {
        proxy.$message.success('选定供应商完成');
        emit('finish');
      })
      .finally(() => {
        state.loading = false;
      });
  }
};
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
