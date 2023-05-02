<template>
  <a-skeleton active :loading="loading">
    <CommonPMTable
      :columns="columns"
      rowKey="pid"
      v-model:data="state.list"
      addButtonText="新增供应商"
      @cellAdd="addSupplier"
      :showAddButton="!canDisabled"
    >
      <template #cell="{ column, record, index, text }">
        <template v-if="column.key === 'supplier'">
          <a-select
            v-model:value="record.id"
            :options="state.userList"
            :disabled="canDisabled"
            placeholder="请选择"
            style="width: 100%"
            @change="(value, options) => expertChange(value, options, record)"
          />
        </template>
      </template>
    </CommonPMTable>
  </a-skeleton>
</template>

<script setup>
import CommonPMTable from '@/components/CommonPMTable/index.vue';
import { ref, getCurrentInstance, onMounted, reactive } from 'vue';
import { supplierList } from '@/api/common';

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
    title: '序号',
    customRender: ({ index }) => `${index + 1}`,
    width: '12%',
  },
  {
    title: '供应商编号',
    dataIndex: 'id',
    width: '20%',
  },
  {
    title: '供应商',
    key: 'supplier',
    width: '20%',
  },
  {
    title: '联系人',
    dataIndex: 'linkman',
    width: '16%',
  },
  {
    title: '联系方式',
    dataIndex: 'linkmanPhone',
    width: '16%',
  },
  {
    title: '电子邮箱',
    dataIndex: 'linkmanEmail',
    width: '16%',
  },
];

const state = reactive({
  userList: [], // 供应商
  list: props.data.map((item) => ({ ...item, pid: item.supplierId, id: item.supplierId })), // 列表数据
});

const loading = ref(false);
onMounted(() => {
  loading.value = true;
  supplierList()
    .then((res) => {
      state.userList = res.map((item) => ({
        label: item.name,
        value: item.id,
        linkman: item.linkman,
        linkmanPhone: item.linkmanPhone,
        linkmanEmail: item.linkmanEmail,
      }));
    })
    .finally(() => {
      loading.value = false;
    });
});

const expertChange = (value, options, record) => {
  console.log(value, options);
  if (value) {
    record.pid = value;
    record.linkman = options.linkman;
    record.linkmanPhone = options.linkmanPhone;
    record.linkmanEmail = options.linkmanEmail;
  } else {
    record.pid = new Date().getTime();
    record.linkman = '';
    record.linkmanPhone = '';
    record.linkmanEmail = '';
  }
};

// 添加一列/删除
const addSupplier = () => {
  state.list.push({
    pid: new Date().getTime(),
    id: undefined,
    linkman: '',
    linkmanPhone: '',
    linkmanEmail: '',
  });
};

const validate = () => {
  const keys = ['id'];
  return new Promise((resolve, reject) => {
    if (state.list && state.list.length > 0) {
      for (let i = 0; i < state.list.length; i++) {
        const element = state.list[i];
        for (let j = 0; j < keys.length; j++) {
          const value = element[keys[j]];
          if (!value) {
            console.log(`请完善供应商信息-${keys[j]}-${value}`);
            proxy.$message.warning('请完善供应商信息');
            reject();
            return;
          }
        }
      }
      resolve(state.list);
    } else {
      proxy.$message.warning('供应商不能为空');
      reject();
    }
  });
};

defineExpose({
  validate,
});
</script>

<style lang="less" scoped></style>
