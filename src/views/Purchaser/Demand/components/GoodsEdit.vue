<template>
  <div>
    <a-skeleton active :loading="loading">
      <CommonPMTable
        v-if="categoryState.list.length > 0"
        :columns="columns"
        rowKey="pid"
        v-model:data="dataSource"
        addButtonText="新增商品"
        @cellAdd="addGoods"
        :scroll="{ x: 1640 }"
        :showAddButton="!canDisabled"
      >
        <template #cell="{ column, record, index, text }">
          <template v-if="column.key === 'category'">
            <a-cascader
              v-model:value="record.categoryId"
              :options="categoryState.list"
              :disabled="canDisabled"
              change-on-select
              placeholder="请选择"
              @change="(value, selectedOptions) => categoryChange(value, selectedOptions, record)"
            />
          </template>
          <template v-else-if="column.key === 'categorySpecs'">
            <a-input
              :disabled="canDisabled"
              v-model:value="record.categorySpecs"
              placeholder="请输入"
            ></a-input>
          </template>
          <template v-else-if="column.key === 'price'">
            <a-input-number
              :min="0"
              :disabled="canDisabled"
              v-model:value="record.price"
              placeholder="请输入"
              style="width: 100%"
            >
              <template #addonAfter>
                <span style="width: 65px; background-color: #f7f7f7; color: rgba(0, 0, 0, 0.65)"
                  >万元</span
                >
              </template>
            </a-input-number>
          </template>
          <template v-else-if="column.key === 'purchase'">
            <a-input-number
              :min="0"
              :disabled="canDisabled"
              v-model:value="record.purchaseCycleValue"
              placeholder="请输入"
              style="width: 100%"
            >
              <template #addonAfter>
                <a-select
                  v-model:value="record.purchaseCycle"
                  style="width: 70px"
                  :disabled="canDisabled"
                  :options="cycleOptions"
                >
                </a-select>
              </template>
            </a-input-number>
          </template>
          <template v-else-if="column.key === 'expectedArrivalTime'">
            <a-date-picker
              v-model:value="record.expectedArrivalTime"
              style="width: 100%"
              placeholder="请选择"
              show-time
              :disabled="canDisabled"
              valueFormat="YYYY-MM-DD HH:mm:ss"
            />
          </template>
          <template v-else-if="column.key === 'remark'">
            <a-input
              :disabled="canDisabled"
              v-model:value="record.remark"
              :placeholder="canDisabled ? '-' : '请输入'"
            ></a-input>
          </template>
          <template v-else-if="column.key === 'attachmentUrlListJson'">
            <template v-if="canDisabled">
              <a
                v-if="record.attachmentUrlList && record.attachmentUrlList.length > 0"
                :href="record.attachmentUrlList[0].url"
                target="_blank"
                >{{ record.attachmentUrlList[0].name }}</a
              >
              <span v-else>无</span>
            </template>
            <a-upload
              v-else
              v-model:file-list="record.attachmentUrlList"
              :before-upload="beforeUpload"
              :customRequest="handleUpload"
              :disabled="canDisabled"
              @remove="handleRemove($event, record)"
            >
              <a-button
                :loading="fileLoading"
                v-if="record.attachmentUrlList === undefined || record.attachmentUrlList.length < 1"
              >
                <upload-outlined></upload-outlined>
                上传附件
              </a-button>
            </a-upload>
          </template>
        </template>
      </CommonPMTable>
    </a-skeleton>
  </div>
</template>

<script setup>
import CommonPMTable from '@/components/CommonPMTable/index.vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import { ref, getCurrentInstance, onMounted, reactive, watch } from 'vue';
import { Upload, categoryAll } from '@/api/common';

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
  // 一级类目id, 若有则list只取一级类目下的数据
  categoryId: {
    type: String,
    default: '',
  },
});

const columns = [
  {
    title: '商品编号',
    dataIndex: 'pid',
    width: 200,
  },
  {
    title: '商品名称',
    key: 'category',
    width: 200,
  },
  {
    title: '规格需求',
    key: 'categorySpecs',
    width: 200,
  },
  {
    title: '总价',
    key: 'price',
    width: 200,
  },
  {
    title: '采购频次',
    key: 'purchase',
    width: 200,
  },
  {
    title: '期望到货时间',
    key: 'expectedArrivalTime',
    width: 280,
  },
  {
    title: '备注',
    key: 'remark',
    width: 180,
  },
  {
    title: '附件',
    key: 'attachmentUrlListJson',
    width: 180,
  },
];

const dataSource = ref([]);

const cycleOptions = [
  { label: '日', value: 1 },
  { label: '周', value: 2 },
  { label: '月', value: 3 },
  { label: '季度', value: 4 },
  { label: '年', value: 5 },
];

watch(
  () => props.categoryId,
  (value) => {
    categoryState.list = [];
    getCategoryList();
  },
);

// 商品类目
const loading = ref(false);
onMounted(() => {
  if (props.canDisabled) {
    dataSource.value = props.data.map((item) => {
      return { ...item, pid: item.categoryId };
    });
    categoryState.list = props.data.map((item) => ({
      value: item.categoryId,
      label: item.categoryName,
    }));
  } else {
    getCategoryList();
  }
});

// 部门数据
const categoryState = reactive({
  list: [],
  ob: null, // {id: item}, 用以根据id递归获取父部门
});
const getCategoryList = () => {
  loading.value = true;
  categoryAll()
    .then((res) => {
      const list = res;
      const ob = {};
      dataClean(list, ob);
      categoryState.list = list;
      categoryState.ob = ob;
      if (props.categoryId) {
        console.log(props.categoryId);
        categoryState.list = list.find((item) => item.id === props.categoryId)?.children ?? [];
      }
      dataSource.value = props.data.map((item) => {
        return { ...item, pid: item.categoryId, categoryId: getCategoryIds(item.categoryId) };
      });
    })
    .finally(() => {
      loading.value = false;
    });
};

const dataClean = (list, ob) => {
  list.forEach((item) => {
    ob[item.id] = item;
    item.label = item.name;
    item.value = item.id;
    if (item.children) {
      if (item.children.length === 0) {
        delete item.children;
      } else {
        dataClean(item.children, ob);
      }
    }
  });
};

const getCategoryIds = (id) => {
  if (!id || id === '0') {
    return [];
  } else {
    const getNextId = (curId, list) => {
      if (!curId || curId === '0') {
        // 根节点
        return;
      }
      list.push(curId);
      getNextId(categoryState.ob[curId]?.parentId, list);
    };
    const ids = [];
    getNextId(id, ids);
    return ids.reverse();
  }
};

const categoryChange = (value, selectedOptions, record) => {
  console.log(value, selectedOptions);
  if (value) {
    record.pid = value.slice(-1)[0];
    record.categoryName = selectedOptions.slice(-1)[0].name;
  } else {
    record.pid = new Date().getTime();
  }
};

// 添加一列/删除
const addGoods = () => {
  dataSource.value.push({
    pid: new Date().getTime(),
    categoryId: undefined,
    categoryName: '',
    categorySpecs: '',
    price: '',
    purchaseCycleValue: '',
    purchaseCycle: 1,
    expectedArrivalTime: undefined,
    remark: '',
    attachmentUrlList: [],
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

const handleRemove = (file, record) => {
  record.attachmentUrlList = [];
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
  const keys = [
    'categoryId',
    'categorySpecs',
    'price',
    'purchaseCycleValue',
    'expectedArrivalTime',
  ];
  // remark、attachmentUrlList
  return new Promise((resolve, reject) => {
    if (dataSource.value && dataSource.value.length > 0) {
      for (let i = 0; i < dataSource.value.length; i++) {
        const element = dataSource.value[i];
        for (let j = 0; j < keys.length; j++) {
          const value = element[keys[j]];
          if (!value) {
            console.log(`请完善商品信息-${keys[j]}-${value}`);
            proxy.$message.warning('请完善商品信息');
            reject();
            return;
          }
        }
      }
      resolve(dataSource.value);
    } else {
      proxy.$message.warning('商品不能为空');
      reject();
    }
  });
};

defineExpose({
  validate,
});
</script>

<style lang="less" scoped></style>
