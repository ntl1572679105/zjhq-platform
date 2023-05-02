<template>
  <a-modal
    v-model:visible="visible"
    :title="formState.title"
    @cancel="handleCancel"
    :destroy-on-close="true"
    :width="600"
    @ok="handleOk"
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
      <a-form-item label="编号" name="type" style="display: none">
        <a-input v-model:value="formState.type" disabled />
      </a-form-item>
      <a-form-item label="规格编号" name="skuId">
        <a-select
          v-model:value="formState.skuId"
          placeholder="请输入选择"
          style="width: 100%"
          :filter-option="false"
          :not-found-content="state.fetching ? undefined : null"
          :options="state.data"
          showSearch
          @change="changeSku"
          @search="fetchGoods"
        >
          <template v-if="state.fetching" #notFoundContent>
            <a-spin size="small" />
          </template>
        </a-select>
      </a-form-item>

      <a-form-item label="排序" name="sort">
        <a-input-number
          :precision="0"
          v-model:value="formState.sort"
          placeholder="请输入"
          style="width: 100%"
        />
      </a-form-item>
      <a-form-item label="价格" name="taxPrice">
        <a-input-number
          :precision="0"
          v-model:value="formState.taxPrice"
          placeholder="请输入"
          style="width: 100%"
          disabled
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { recommenderAdd, recommenderEdit } from '@/api/operator/home';
import { skuList } from '@/api/common';
import { reactive, ref, getCurrentInstance, watch } from 'vue';
import { debounce } from 'lodash-es';

export default {
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const formRef = ref();
    const formState = reactive({
      title: '',
      id: undefined,
      skuId: [],
      sort: '',
      taxPrice: '',
      type: '',
    });
    const rules = {
      skuId: [{ required: true, message: '请选择' }],
    };

    let lastFetchId = 0;
    const state = reactive({
      data: [],
      fetching: false,
    });
    const fetchGoods = debounce((value) => {
      console.log('fetching skus', value);
      lastFetchId += 1;
      const fetchId = lastFetchId;
      state.data = [];
      state.fetching = true;
      if (!value) {
        state.fetching = false;
        return;
      }
      skuList(value)
        .then((res) => {
          if (fetchId !== lastFetchId) {
            return;
          }
          const data = [];
          res.forEach((product) => {
            product.skus &&
              product.skus.forEach((sku) => {
                data.push({
                  label: `${sku.sku ? `${sku.sku.key}：${sku.sku.value}` : `-`}(${sku.id})`,
                  value: sku.id,
                  taxPrice: sku.taxPrice,
                });
              });
          });
          state.data = data;
          state.fetching = false;
        })
        .finally(() => {
          state.fetching = false;
        });
    }, 300);

    const changeSku = (value, option) => {
      formState.taxPrice = option.taxPrice;
    };

    watch(formState.skuId, () => {
      state.data = [];
      state.fetching = false;
    });

    const loading = ref(false);
    const visible = ref(false);

    const show = (item) => {
      visible.value = true;
      Object.keys(formState).forEach((key) => {
        formState[key] = item[key] ?? undefined;
      });

      if (item && item.attributeDTO) {
        state.data = [
          {
            label: `${item.attributeDTO.key}：${item.attributeDTO.value}(${item.skuId})`,
            value: item.skuId,
          },
        ];
      } else {
        state.data = [];
      }
    };

    // 按钮操作
    const handleCancel = () => {
      formRef.value.resetFields();
      visible.value = false;
    };
    const handleOk = () => {
      formRef.value.validateFields().then((values) => {
        loading.value = true;
        const api = values.id ? recommenderEdit : recommenderAdd;
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
      show,
      handleCancel,
      handleOk,
      fetchGoods,
      state,
      changeSku,
    };
  },
};
</script>
