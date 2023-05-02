<template>
  <a-list
    item-layout="vertical"
    :pagination="pagination"
    :data-source="listData"
    :loading="loading"
  >
    <template #renderItem="{ item }">
      <div class="item-box">
        <div class="item-title">{{ item.title }}</div>
        <div class="item-middle">
          <div class="mr-16">
            创建人<span>{{ item.createBy }}</span>
          </div>
          <div>{{ item.createTime }}</div>
        </div>
        <div class="item-bottom" @click.stop="showDetail(item)">
          <span>阅读详情</span>
          <img src="@/assets/images/icon-system-right@2x.png" />
        </div>
      </div>

      <!-- <div>{{ item.content }}</div> -->
      <!-- <div>{{ item.detailUrl }}</div> -->
    </template>
  </a-list>
  <DetailModal ref="detailModal" />
</template>

<script setup>
import { messageList } from '@/api/message';
import { ref, onMounted, reactive, getCurrentInstance } from 'vue';
import DetailModal from './DetailModal.vue';

const props = defineProps({
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
    default: 5,
  },
  showSizeChanger: {
    type: Boolean,
    default: true,
  },
  showPagination: {
    type: Boolean,
    default: true,
  },
  // 首次加载是否自动请求
  isLoad: {
    type: Boolean,
    default: true,
  },
});

const { proxy } = getCurrentInstance();
const loading = ref(false);
const listData = ref([]);

const pagination = reactive({
  hideOnSinglePage: true,
  pageSize: props.pageSize,
  total: 0,
  current: props.pageNum,
  showSizeChanger: props.showSizeChanger,
  pageSizeOptions: ['3', '5', '10'],
  onChange: (page, pageSize) => {
    pagination.current = page;
    pagination.pageSize = pageSize;
    getList(props.params);
  },
  onShowSizeChange: (current, size) => {
    pagination.current = current;
    pagination.pageSize = size;
    getList(props.params);
  },
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
  messageList(requestParameters)
    .then((res) => {
      if (props.showPagination) {
        listData.value = res.data;
        pagination.total = res.total;
      } else {
        listData.value = res;
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

const tableSearch = () => {
  getList(props.params);
};

const tableReset = () => {
  pagination.current = props.pageNum;
  pagination.pageSize = props.pageSize;
  getList(props.params);
};

const showDetail = (record) => {
  proxy.$refs.detailModal.show(record.id, record.title);
};

defineExpose({
  tableSearch,
  tableReset,
});
</script>

<style lang="less" scoped>
.item-box {
  border: 1px solid #00000014;
  border-radius: 2px;
  margin-bottom: 16px;
  .item-title {
    opacity: 0.85;
    font-weight: 500;
    font-size: 16px;
    color: #000000;
    line-height: 24px;
    padding: 16px 16px 0;
  }
  .item-middle {
    display: flex;
    margin-top: 12px;
    margin-left: 16px;
    font-size: 14px;
    color: #00000073;
    line-height: 22px;
    span {
      margin-left: 4px;
      color: #000000a6;
    }
  }
  .item-bottom {
    width: 100%;
    height: 39px;
    background: #0000000a;
    margin-top: 16px;
    display: flex;
    align-items: center;
    padding-left: 20px;
    cursor: pointer;
    span {
      font-weight: 500;
      font-size: 14px;
      color: #1b77ff;
      line-height: 22px;
    }
    img {
      margin-left: 8px;
      width: 16px;
      height: 16px;
    }
  }
}
</style>
