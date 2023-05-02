<template>
  <slot name="action"></slot>
  <a-table
    ref="table"
    size="default"
    :row-key="rowKey"
    :columns="columns"
    :data-source="dataSource.list"
    :loading="loading"
    :pagination="showPagination ? pagination : false"
    @change="tableChange"
    :scroll="scroll"
    :row-selection="rowSelection"
  >
    <template #bodyCell="{ column, record, index, text }">
      <slot name="cell" :column="column" :record="record" :index="index" :text="text"></slot>
    </template>
  </a-table>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';

const props = defineProps({
  // table 列表row-key
  rowKey: {
    type: String,
    default: 'id',
  },
  // table columns
  columns: {
    type: Array,
    default: () => [],
  },
  // table list api
  api: {
    type: Function,
    required: true,
  },
  // table api params
  params: {
    type: Object,
    default: () => {},
  },
  // 分页相关
  pageNum: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
  showSizeChanger: {
    type: Boolean,
    default: true,
  },
  showPagination: {
    type: Boolean,
    default: true,
  },
  // 滚动
  scroll: {
    type: Object,
    default: () => {},
  },
  // 首次加载是否自动请求
  isLoad: {
    type: Boolean,
    default: true,
  },
  // 可选列表
  rowSelection: {
    type: Object,
    default: null,
  },
});

const loading = ref(false);
const dataSource = reactive({
  list: [],
});
const pagination = reactive({
  hideOnSinglePage: true,
  pageSize: props.pageSize,
  total: 0,
  current: props.pageNum,
  showSizeChanger: props.showSizeChanger,
  pageSizeOptions: ['10', '20', '50'],
});

onMounted(() => {
  props.isLoad && tableSearch();
});

const getList = (formData) => {
  loading.value = true;
  const requestParameters = Object.assign(
    { pageNum: pagination.current, pageSize: pagination.pageSize },
    formData,
  );
  console.log('loadData request parameters:', requestParameters);
  props
    .api(requestParameters)
    .then((res) => {
      if (props.showPagination) {
        dataSource.list = res.data;
        pagination.total = res.total;
      } else {
        dataSource.list = res;
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

const tableChange = (page) => {
  pagination.current = page.current;
  pagination.pageSize = page.pageSize;
  getList(props.params);
};

const tableSearch = () => {
  getList(props.params);
};

const tableReset = () => {
  pagination.current = props.pageNum;
  pagination.pageSize = props.pageSize;
  getList(props.params);
};

defineExpose({
  tableSearch,
  tableReset,
});
</script>
