<template>
  <a-modal v-model:visible="visible" title="预算详情" :destroy-on-close="true" :width="800">
    <template #footer>
      <a-button key="submit" type="primary" @click="handleOk">确定</a-button>
    </template>
    <div>
      <div class="f-20 mb-16">{{ formState.name }}</div>
      <a-table
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :dataSource="formState.list"
        :pagination="false"
      >
        <template #bodyCell="{ column, record, index, text }">
          <template v-if="column.key === 'type'">
            {{ typeName(text) }}
          </template>
        </template>
      </a-table>
    </div>
  </a-modal>
</template>

<script>
import { computed, reactive, ref } from 'vue';
import { budgetDetail } from '@/api/operator/demand.js';

export default {
  setup(props, { emit }) {
    const formState = reactive({
      id: undefined,
      name: '',
      loading: false,
      list: [],
    });
    const columns = [
      {
        title: '业务编号',
        dataIndex: 'bizId',
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: '金额',
        dataIndex: 'changeBudget',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
      },
    ];

    const loading = ref(false);
    const visible = ref(false);

    const show = (item) => {
      visible.value = true;
      formState.id = item.id;
      formState.name = item.name;
      formState.list = [];
      getDetail();
    };

    const getDetail = () => {
      formState.loading = true;
      budgetDetail(formState.id)
        .then((res) => {
          formState.list = res;
        })
        .finally(() => {
          formState.loading = false;
        });
    };

    const typeName = computed(() => {
      return (value) => {
        // 1-中标增加 2-订单支出
        return ['', '中标增加', '订单支出'][value];
      };
    });

    // 按钮操作
    const handleOk = () => {
      visible.value = false;
    };

    return {
      formState,
      columns,
      loading,
      visible,
      show,
      handleOk,
      typeName,
    };
  },
};
</script>
