<template>
  <a-modal v-model:visible="visible" title="规格详情" :destroy-on-close="true" :width="700">
    <template #footer>
      <a-button key="submit" type="primary" @click="handleOk">确定</a-button>
    </template>
    <div>
      <div class="table-operator">
        <a-button type="primary" @click="handleAdd"> 新增 </a-button>
      </div>
      <a-table
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :dataSource="formState.specList"
        :pagination="false"
      >
        <template #bodyCell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="handleEdit(record)">编辑</a>
              <a @click="deleteSub(record, index)" style="color: #ff4d4f">删除</a>
            </a-space>
          </template>
        </template>
      </a-table>
      <SpecHandleModal ref="specHandleModal" @finish="addRow" />
    </div>
  </a-modal>
</template>

<script>
import { reactive, ref, getCurrentInstance } from 'vue';
import { categorySpecDelete } from '@/api/operator/demand.js';
import SpecHandleModal from './SpecHandleModal.vue';

export default {
  components: {
    SpecHandleModal,
  },
  setup(props, { emit }) {
    const formState = reactive({
      categoryId: undefined,
      specList: [],
    });
    const columns = [
      {
        title: '规格名称',
        dataIndex: 'specKey',
      },
      {
        title: '规格值',
        dataIndex: 'specValue',
      },
      {
        title: '排序',
        dataIndex: 'sort',
      },
      {
        title: '操作',
        key: 'action',
        width: '25%',
        align: 'center',
      },
    ];

    const { proxy } = getCurrentInstance();
    const loading = ref(false);
    const visible = ref(false);

    const show = (item) => {
      visible.value = true;
      Object.keys(formState).forEach((key) => {
        formState[key] = item[key] || undefined;
      });
    };

    // 按钮操作
    const handleOk = () => {
      visible.value = false;
    };

    const deleteSub = (record, index) => {
      proxy.$confirm({
        title: `确认删除该规格-${record.specKey}吗?`,
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          categorySpecDelete(record.id).then(() => {
            proxy.$message.success('删除成功');
            formState.specList.splice(index, 1);
          });
        },
      });
    };
    const handleAdd = () => {
      proxy.$refs.specHandleModal.show({
        title: '添加',
        categoryId: formState.categoryId,
      });
    };

    const handleEdit = (record) => {
      proxy.$refs.specHandleModal.show({
        title: '修改',
        ...record,
        categoryId: formState.categoryId,
      });
    };

    const addRow = (record) => {
      const index = formState.specList.findIndex((item) => item.id === record.id);
      if (index === -1) {
        formState.specList.push(record);
      } else {
        formState.specList[index] = record;
      }
    };

    return {
      formState,
      columns,
      loading,
      visible,
      show,
      handleOk,
      handleAdd,
      handleEdit,
      deleteSub,
      addRow,
    };
  },
};
</script>
