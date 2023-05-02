<template>
  <a-modal
    v-model:visible="visible"
    title="商品信息"
    @cancel="handleCancel"
    :destroy-on-close="true"
    :width="800"
    @ok="handleOk"
  >
    <template #footer>
      <a-button key="back" @click="handleCancel"> 取消 </a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="handleOk">加入清单</a-button>
    </template>

    <div class="detail-container">
      <div class="detail-top">
        <img :src="formState.imgUrl" />
        <div class="detail-top-right">
          <div class="detail-top-right-title">{{ formState.name }}</div>
          <div class="detail-top-right-titlebox"></div>
          <div class="detail-top-right-skusbox">
            <div class="detail-top-right-skusbox-tips">规格需求：</div>
            <div class="detail-top-right-skusbox-boxs">
              <div
                class="detail-top-right-skusbox-boxs-item"
                v-for="(sku, index) in formState.specList"
                :key="index"
              >
                <span>{{ sku.specKey }}：</span>
                <a-input
                  v-if="sku.options"
                  placeholder="请输入"
                  v-model:value="formState.skus[sku.specValue]"
                >
                  <template #addonAfter>
                    <a-select
                      v-model:value="formState.skus[sku.okey]"
                      style="width: 70px"
                      :options="sku.options"
                    ></a-select>
                  </template>
                </a-input>
                <a-input
                  v-else
                  placeholder="请输入"
                  v-model:value="formState.skus[sku.specValue]"
                ></a-input>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="detail-bottom">
        <a-form
          ref="formRef"
          :model="formState"
          :rules="rules"
          :label-col="{ xs: 24, md: 5 }"
          :wrapper-col="{ xs: 24, md: 14 }"
          label-align="right"
        >
          <a-form-item label="采购金额" name="price">
            <a-input-number
              :min="0"
              v-model:value="formState.price"
              placeholder="请输入"
              style="width: 100%"
            >
              <template #addonAfter>
                <span style="width: 65px; background-color: #f7f7f7; color: rgba(0, 0, 0, 0.65)"
                  >万元</span
                >
              </template>
            </a-input-number>
          </a-form-item>
          <a-form-item label="采购周期" name="purchaseCycleValue">
            <a-input-number
              :min="0"
              v-model:value="formState.purchaseCycleValue"
              placeholder="请输入"
              style="width: 100%"
            >
              <template #addonAfter>
                <a-select
                  v-model:value="formState.purchaseCycle"
                  style="width: 60px"
                  :options="cycleOptions"
                >
                </a-select>
              </template>
            </a-input-number>
          </a-form-item>
          <a-form-item label="期望到货时间" name="expectedArrivalTime">
            <a-date-picker
              v-model:value="formState.expectedArrivalTime"
              style="width: 100%"
              placeholder="请选择"
              show-time
              valueFormat="YYYY-MM-DD HH:mm:ss"
            />
          </a-form-item>
          <a-form-item label="采购备注" name="remark">
            <a-textarea
              v-model:value="formState.remark"
              :rows="4"
              placeholder="请输入"
              :maxlength="300"
            />
          </a-form-item>
        </a-form>
      </div>
    </div>
  </a-modal>
</template>

<script>
import { reactive, ref } from 'vue';

export default {
  setup(props, { emit }) {
    const formRef = ref();
    const formState = reactive({
      id: undefined,
      imgUrl: '',
      name: '',
      specList: [],

      skus: {},

      price: '',
      expectedArrivalTime: undefined,
      purchaseCycleValue: '',
      purchaseCycle: 1,
      remark: '',
    });
    const rules = {
      expectedArrivalTime: [{ required: true, message: '请选择' }],
      purchaseCycleValue: [{ required: true, message: '请输入' }],
      price: [{ required: true, message: '请输入' }],
    };
    const cycleOptions = [
      { label: '日', value: 1 },
      { label: '周', value: 2 },
      { label: '月', value: 3 },
      { label: '季度', value: 4 },
      { label: '年', value: 5 },
    ];

    const loading = ref(false);
    const visible = ref(false);

    const show = (item) => {
      visible.value = true;
      Object.keys(formState).forEach((key) => {
        formState[key] = item[key] || undefined;
      });
      formState.skus = {};
      formState.purchaseCycle = 1;
    };

    // 按钮操作
    const handleCancel = () => {
      formRef.value.resetFields();
      visible.value = false;
    };
    const handleOk = () => {
      formRef.value.validateFields().then((values) => {
        const skus = [];
        // const specParamList = [];
        for (let index = 0; index < formState.specList.length; index++) {
          const element = formState.specList[index];
          let string = `${element.specKey}：${formState.skus[element.specValue] || '-'}`;
          if (element.options) {
            string += formState.skus[element.okey];
          }
          //   specParamList.push({ specKey: element.specKey, specValue: values.skus[element.specValue] });
          skus.push(string);
        }
        visible.value = false;
        emit('finish', {
          categoryId: formState.id,
          categoryName: formState.name,
          categorySpecs: skus.join('  '),
          imgUrl: formState.imgUrl,
          purchaseCycle: formState.purchaseCycle,
          ...values,
        });
      });
    };

    return {
      formRef,
      formState,
      rules,
      loading,
      visible,
      cycleOptions,
      show,
      handleCancel,
      handleOk,
    };
  },
};
</script>

<style lang="less" scoped>
::v-deep(.ant-input-group .ant-input) {
  text-align: left !important;
}
.detail-container {
  margin-top: 12px;
  background: #fff;
  flex: 1;
  .detail-top {
    display: flex;
    padding-bottom: 25px;
    border-bottom: 0.5px dashed rgba(0, 0, 0, 0.15);
    img {
      width: 280px;
      height: 280px;
      object-fit: cover;
      margin-right: 24px;
    }
    &-right {
      display: flex;
      flex-direction: column;
      &-title {
        font-weight: 500;
        font-size: 18px;
        color: rgba(0, 0, 0, 0.85);
        letter-spacing: 0;
        line-height: 26px;
        margin-bottom: 12px;
      }
      &-titlebox {
        display: flex;
        align-items: center;
        font-size: 14px;
        line-height: 24px;
        letter-spacing: 0;
        span:nth-child(1) {
          font-weight: 500;
          color: #c52b2b;
        }
        span:nth-child(2) {
          font-weight: 400;
          color: rgba(0, 0, 0, 0.85);
          margin: 0 2px;
        }
      }
      &-skusbox {
        // height: 198px;
        margin-top: 12px;
        width: 100%;
        background: #f7f7f7;
        padding: 12px 16px;
        display: flex;
        flex-direction: column;
        font-size: 14px;
        &-tips {
          font-weight: 500;
          color: rgba(0, 0, 0, 0.85);
          line-height: 24px;
          margin-bottom: 12px;
        }
        &-boxs {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          &-item {
            display: flex;
            align-items: center;
            width: 48%;
            margin-bottom: 8px;
            span {
              min-width: 100px;
              text-align: right;
            }
          }
        }
        &-remark {
          display: flex;
          align-items: center;
          span {
            min-width: 80px;
            text-align: right;
          }
        }
        &-last {
          margin-top: 4px;
          font-weight: 400;
          font-size: 12px;
          color: rgba(0, 0, 0, 0.25);
          line-height: 24px;
          margin-left: 25px;
        }
      }
    }
  }
  .detail-bottom {
    margin-top: 25px;
  }
}
</style>
