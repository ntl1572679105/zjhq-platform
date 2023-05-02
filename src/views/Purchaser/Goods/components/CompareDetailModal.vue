<template>
  <a-modal
    v-model:visible="visible"
    title="比价详情"
    @cancel="handleCancel"
    :destroy-on-close="true"
    :width="600"
    centered
  >
    <template #footer>
      <a-button key="back" @click="handleCancel"> 关闭 </a-button>
    </template>
    <a-form
      ref="formRef"
      :model="formState"
      :label-col="{ xs: 24, md: 5 }"
      :wrapper-col="{ xs: 24, md: 14 }"
      label-align="right"
    >
      <a-form-item label="商品名称">
        <span>{{ formState.name }}</span>
      </a-form-item>
      <a-form-item label="规格">
        <span>{{
          formState.attributeDTO
            ? `${formState.attributeDTO.key}：${formState.attributeDTO.value}`
            : '-'
        }}</span>
      </a-form-item>
      <a-form-item label="价格来源" name="source">
        <a-select
          v-model:value="formState.source"
          :options="sourceOptions"
          allowClear
          @change="sourceChange"
          placeholder="请选择价格来源"
        />
      </a-form-item>

      <a-table
        :columns="columns"
        :dataSource="dataSource.list"
        :loading="loading"
        :pagination="false"
        bordered
      >
        <template #bodyCell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a v-if="record.isEdit" @click="handleSave(record)">保存</a>
              <a v-else @click="handleEdit(record)">编辑</a>
              <a @click="deleteSub(record)" style="color: #ff4d4f">删除</a>
            </a-space>
          </template>
          <template v-else-if="column.key === 'amount'">
            <a-input-number
              v-if="record.isEdit"
              v-model:value="record.price"
              :precision="2"
            ></a-input-number>
            <span v-else>{{ totalAmount(text) }}</span>
          </template>
        </template>
      </a-table>
    </a-form>
  </a-modal>
</template>

<script>
import { reactive, ref, getCurrentInstance, watch, createVNode, computed } from 'vue';
import { getPriceSourceDict } from '@/api/common.js';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { deleteProductCompare, updateProductCompare, compareDetailList } from '@/api/goods.js';
import { Modal, message } from 'ant-design-vue';

export default {
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const formRef = ref();
    const formState = reactive({
      name: undefined,
      attributeDTO: undefined,
      productId: undefined,
      source: undefined,
      skuId: undefined,
    });

    const columns = [
      {
        title: '获取日期',
        dataIndex: 'createTime',
      },
      {
        title: '价格',
        dataIndex: 'price',
        key: 'amount',
      },
      {
        title: '操作',
        key: 'action',
      },
    ];

    const loading = ref(false);
    const visible = ref(false);
    const sourceOptions = ref([]);

    const show = (item) => {
      dataSource.list = [];
      dataSource.params = {};
      Object.keys(formState).forEach((key) => {
        formState[key] = item[key] ?? undefined;
      });
      visible.value = true;

      getDict();
    };

    const sourceChange = () => {
      getList();
    };

    const dataSource = reactive({
      list: [],
      params: {},
    });

    const getDict = () => {
      if (sourceOptions.value.length === 0) {
        loading.value = true;
        getPriceSourceDict().then((res) => {
          sourceOptions.value = res.map((item) => ({
            label: item.dictKey,
            value: item.dictKey,
          }));
          formState.source = sourceOptions.value[0].value;
          getList();
        });
      } else {
        formState.source = sourceOptions.value[0].value;
        getList();
      }
    };

    const getList = () => {
      loading.value = true;
      dataSource.params = {
        productId: formState.productId,
        source: formState.source,
        skuId: formState.skuId,
      };
      compareDetailList(dataSource.params)
        .then((res) => {
          dataSource.list = res;
        })
        .finally(() => {
          loading.value = false;
        });
    };

    // 按钮操作
    const handleCancel = () => {
      formRef.value.resetFields();
      visible.value = false;
    };

    // 金额
    const totalAmount = computed(() => {
      return (values) => {
        return values ? `￥${Number(values).toFixed(2)}` : '￥0';
      };
    });

    const handleEdit = (record) => {
      record.isEdit = true;
    };

    const handleSave = (record) => {
      const params = {
        id: record.id,
        price: record.price,
      };
      updateProductCompare(params).then((res) => {
        message.success('编辑成功');
        record.isEdit = false;
      });
    };

    const deleteSub = (record) => {
      Modal.confirm({
        title: '操作确认',
        icon: createVNode(ExclamationCircleOutlined),
        content: '确认删除？',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          deleteProductCompare(record.id).then(() => {
            message.success('删除成功');
            getList();
          });
        },
        onCancel() {
          Modal.destroyAll();
        },
      });
    };

    return {
      formRef,
      formState,
      loading,
      visible,
      sourceOptions,
      sourceChange,
      columns,
      dataSource,
      totalAmount,
      show,
      handleCancel,
      handleEdit,
      handleSave,
      deleteSub,
    };
  },
};
</script>
