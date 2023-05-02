<template>
  <a-modal
    v-model:visible="visible"
    title="新增比价"
    @cancel="handleCancel"
    :destroy-on-close="true"
    :width="600"
    centered
  >
    <template #footer>
      <a-button key="back" @click="handleCancel"> 取消 </a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="handleOk">确定</a-button>
    </template>
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="{ xs: 24, md: 5 }"
      :wrapper-col="{ xs: 24, md: 14 }"
      label-align="right"
    >
      <a-form-item label="编号" name="id" style="display: none">
        <a-input v-model:value="formState.id" disabled />
      </a-form-item>
      <a-form-item label="商品名称" name="productId">
        <a-select
          v-model:value="formState.productId"
          placeholder="请选择"
          allowClear
          show-search
          :filter-option="false"
          :not-found-content="productState.fetching ? undefined : null"
          :options="productState.data"
          @change="changeProduct"
          @search="fetchProducts"
        >
          <template v-if="productState.fetching" #notFoundContent>
            <a-spin size="small" />
          </template>
        </a-select>
      </a-form-item>
      <a-form-item label="规格" name="skuId">
        <a-select
          v-model:value="formState.skuId"
          :options="skusOptions"
          allowClear
          style="width: 100%"
          placeholder="请选择商品规格"
        />
      </a-form-item>
      <a-form-item label="价格来源" name="source">
        <a-select
          v-model:value="formState.source"
          :options="sourceOptions"
          allowClear
          placeholder="请选择价格来源"
        />
      </a-form-item>
      <a-form-item label="价格" name="price">
        <a-input v-model:value="formState.price" allowClear placeholder="请输入价格" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { reactive, ref, getCurrentInstance, watch, onMounted } from 'vue';
import { getPriceSourceDict } from '@/api/common.js';
import { addProductCompare, updateProductCompare, GoodsList } from '@/api/goods.js';
import { debounce } from 'lodash-es';

export default {
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const formRef = ref();
    const formState = reactive({
      id: undefined,
      productId: [],
      source: undefined,
      skuId: undefined,
      price: undefined,
    });
    const rules = {
      productId: [{ required: true, message: '请选择商品' }],
      skuId: [{ required: true, message: '请选择商品规格' }],
      source: [{ required: true, message: '请选择商品来源' }],
      price: [{ required: true, message: '请输入商品价格' }],
    };

    const loading = ref(false);
    const visible = ref(false);
    const skusOptions = ref([]);
    const sourceOptions = ref([]);

    const show = (item) => {
      Object.keys(formState).forEach((key) => {
        formState[key] = item[key] ?? undefined;
      });
      skusOptions.value = [];
      visible.value = true;
    };

    onMounted(() => {
      getDict();
    });

    // 获取字典内容
    const getDict = () => {
      getPriceSourceDict().then((res) => {
        sourceOptions.value = res.map((item) => ({
          label: item.dictKey,
          value: item.dictKey,
        }));
      });
    };

    let lastFetchId = 0;
    const productState = reactive({
      data: [],
      fetching: false,
    });

    const fetchProducts = debounce((value) => {
      console.log('fetching product: ', value);
      lastFetchId += 1;
      const fetchId = lastFetchId;
      productState.data = [];
      productState.fetching = true;
      GoodsList({ name: value, pageNum: 1, pageSize: 20 }).then((res) => {
        if (fetchId !== lastFetchId) return;
        productState.data = res.data.map((item) => ({
          label: item.name,
          value: item.id,
          skus: item.skuVos.map((sku) => ({
            label: `${
              sku.attributeDTO ? `${sku.attributeDTO.key}：${sku.attributeDTO.value}` : `-`
            }(${sku.id})`,
            value: sku.id,
          })),
        }));
        productState.fetching = false;
      });
    }, 300);

    const changeProduct = (value, option) => {
      skusOptions.value = option.skus;
      formState.skuId = undefined;
    };

    watch(formState.productId, () => {
      productState.data = [];
      productState.fetching = false;
      skusOptions.value = [];
      formState.skuId = undefined;
    });

    // 按钮操作
    const handleCancel = () => {
      formRef.value.resetFields();
      visible.value = false;
    };
    const handleOk = () => {
      formRef.value.validateFields().then((values) => {
        loading.value = true;
        const api = values.id ? updateProductCompare : addProductCompare;
        const content = values.id ? '修改成功' : '新增成功';
        api(values)
          .then(() => {
            proxy.$message.success(content);
            emit('finish');
            visible.value = false;
          })
          .finally(() => {
            loading.value = false;
          });
      });
    };

    return {
      formRef,
      formState,
      rules,
      loading,
      visible,
      skusOptions,
      sourceOptions,
      productState,
      fetchProducts,
      changeProduct,
      show,
      handleCancel,
      handleOk,
    };
  },
};
</script>
