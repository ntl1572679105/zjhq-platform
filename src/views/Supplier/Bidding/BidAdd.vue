<template>
  <PageContainer>
    <CommonTitleAction title="投标单">
      <template #right>
        <a-button :loading="submitLoading" @click="onFinish" type="primary">提交</a-button>
      </template>
    </CommonTitleAction>
    <div class="bg-main">
      <a-skeleton active :loading="loading">
        <CommonSubTitle title="基本信息" />
        <CommonForm ref="infoForm" :formItems="formItems[0]" :formData="formData[0]" />

        <CommonSubTitle title="投标文件" />
        <CommonForm ref="fileForm" :formItems="formItems[1]" :formData="formData[1]" />

        <CommonSubTitle title="商品明细" />
        <GoodsEdit :data="dataSource.goods" ref="goodsEdit" />
      </a-skeleton>
    </div>
  </PageContainer>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance, reactive } from 'vue';
import CommonTitleAction from '@/components/CommonTitleAction/index.vue';
import CommonForm from '@/components/CommonForm/index.vue';
import CommonSubTitle from '@/components/CommonSubTitle/index.vue';

import { bidAdd, bidDtail } from '@/api/supplier/bid';
import GoodsEdit from './components/GoodsEdit.vue';

const loading = ref(false);
const { proxy } = getCurrentInstance();
const props = defineProps({
  id: String,
});

// 表单配置
const formItems = ref([
  [
    {
      type: 'text',
      label: '投标单标题',
      value: 'title',
      rules: true,
    },
    {
      type: 'text',
      label: '联系方式',
      value: 'phone',
      rules: true,
    },
    {
      type: 'number',
      label: '报价总金额',
      value: 'quoteAmount',
      rules: true,
    },
    {
      type: 'textarea',
      label: '备注',
      value: 'remark',
      rules: true,
    },
  ],
  [
    {
      type: 'file',
      label: '投标文件',
      value: 'tenderAttachmentUrlListJson',
      rules: true,
    },
    {
      type: 'file',
      label: '商务附件',
      value: 'businessAttachmentUrlListJson',
      rules: true,
    },
    {
      type: 'file',
      label: '技术附件',
      value: 'technologyAttachmentUrlListJson',
      rules: true,
    },
  ],
]);

const dataSource = reactive({
  goods: [], // 商品明细
});

const formData = ref(new Array(formItems.value.length).fill([]));

onMounted(() => {
  // 组装默认的formData
  const tempList = [];
  formItems.value.forEach((child) => {
    const el = {};
    child.forEach((item) => {
      el[item.value] = undefined;
    });
    tempList.push(el);
  });
  formData.value = tempList;
  props.id && getDetail();
});

const getDetail = () => {
  loading.value = true;
  bidDtail(props.id)
    .then((res) => {
      dataSource.goods = res.bidItemList.map((item) => ({
        categoryId: item.categoryId,
        categoryName: item.categoryName,
        categorySpecs: item.categorySpecs,
      }));
    })
    .finally(() => {
      loading.value = false;
    });
};

// 提交保存
const submitLoading = ref(false);
const onFinish = () => {
  const { infoForm, fileForm, goodsEdit } = proxy.$refs;
  Promise.all([infoForm.validateFields(), fileForm.validateFields(), goodsEdit.validate()]).then(
    (result) => {
      const info = result[0];
      const files = result[1];
      if (Array.isArray(info.demandDeptId)) {
        info.demandDeptId = info.demandDeptId.slice(-1)[0];
      }
      if (Array.isArray(files.tenderAttachmentUrlListJson)) {
        files.tenderAttachmentUrlListJson = files.tenderAttachmentUrlListJson[0].url;
      }
      if (Array.isArray(files.businessAttachmentUrlListJson)) {
        files.businessAttachmentUrlListJson = files.businessAttachmentUrlListJson[0].url;
      }
      if (Array.isArray(files.technologyAttachmentUrlListJson)) {
        files.technologyAttachmentUrlListJson = files.technologyAttachmentUrlListJson[0].url;
      }

      const bidSupplierItemParamList = result[2];
      bidSupplierItemParamList.forEach((item) => {
        if (Array.isArray(item.effectiveTime)) {
          item.effectiveStartTime = item.effectiveTime[0];
          item.effectiveEndTime = item.effectiveTime[1];
          item.effectiveTime = null;
        }
      });

      const params = {
        ...info,
        ...files,
        bidSupplierItemParamList,
        bidId: props.id,
      };
      console.log(params);

      submitLoading.value = true;
      bidAdd(params)
        .then(() => {
          proxy.$message.success('提交成功');
          proxy.$router.go(-1);
        })
        .finally(() => {
          submitLoading.value = false;
        });
    },
  );
};
</script>

<style lang="less" scoped></style>
