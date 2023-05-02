<template>
  <PageContainer>
    <CommonTitleAction :title="pageState.title">
      <template #right v-if="pageState.buttonTitle">
        <a-button :loading="submitLoading" @click="onFinish" type="primary">{{
          pageState.buttonTitle
        }}</a-button>
      </template>
    </CommonTitleAction>
    <div class="bg-main">
      <a-skeleton active :loading="loading">
        <div>
          <CommonSubTitle title="基本信息" />
          <CommonForm
            ref="infoForm"
            class="mb-10"
            :canDisabled="pageState.canDisabled"
            :formItems="formItems[0]"
            :formData="formData[0]"
          />
          <CommonSubTitle title="商品规格" />
          <GoodsEdit :data="dataSource.skus" ref="skuForm" :canDisabled="pageState.canDisabled" />
          <CommonSubTitle title="单位设置" />
          <CommonForm
            :canDisabled="pageState.canDisabled"
            ref="unitForm"
            :formItems="formItems[1]"
            :formData="formData[1]"
          />
          <CommonSubTitle title="其他信息" />
          <CommonForm
            :canDisabled="pageState.canDisabled"
            ref="otherForm"
            :formItems="formItems[2]"
            :formData="formData[2]"
          />
          <CommonSubTitle title="图片上传" />
          <a-form class="mainImgForm" :model="mainFileList" ref="imgForm" layout="vertical">
            <a-form-item name="mainUrl">
              <template #label>
                <span
                  >商品图片<span class="f-12 c-0045"
                    >（图片尺寸：800x800px，大小≤3M，支持JPG、PNG、JPEG）</span
                  ></span
                >
              </template>
              <a-upload
                :disabled="pageState.canDisabled"
                v-model:file-list="mainFileList"
                :customRequest="handleMainUpload"
                name="mainImg"
                list-type="picture-card"
                class="avatar-uploader"
                accept="image/png, image/jpeg, image/jpg"
                :before-upload="beforeUpload"
                @preview="handlePreview"
                @remove="handleMainRemove"
              >
                <div v-if="mainFileList.length < 1">
                  <loading-outlined v-if="mainUploading"></loading-outlined>
                  <plus-outlined v-else></plus-outlined>
                  <div class="ant-upload-text">上传</div>
                </div>
              </a-upload>
            </a-form-item>
          </a-form>
        </div>
      </a-skeleton>
      <a-modal
        :visible="previewVisible"
        :footer="null"
        @cancel="handleCancel"
        centered
        width="500px"
      >
        <img style="width: 100%" :src="previewImage" />
      </a-modal>
    </div>
  </PageContainer>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance, reactive } from 'vue';
import CommonTitleAction from '@/components/CommonTitleAction/index.vue';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import CommonForm from '@/components/CommonForm/index.vue';
import CommonSubTitle from '@/components/CommonSubTitle/index.vue';
import GoodsEdit from './components/GoodsEdit.vue';
import { UpdateGoods, AddGoods, GoodsDetail } from '@/api/goods.js';
import { getUnitDict, Upload, categoryAll } from '@/api/common.js';

const { proxy } = getCurrentInstance();
const props = defineProps({
  id: String,
  type: String, // 1: 查看 2：编辑
});

// 标题及按钮
const pageState = reactive({
  title: '',
  canDisabled: false,
  buttonTitle: '',
});

const loading = ref(false);

const setupPage = () => {
  if (props.type) {
    pageState.title = ['', '商品详情', '编辑商品'][props.type];
    if (props.type === '2') {
      pageState.buttonTitle = '保存';
      pageState.canDisabled = false;
    } else {
      pageState.buttonTitle = '';
      pageState.canDisabled = true;
    }
  } else {
    pageState.title = '新建商品';
    pageState.buttonTitle = '提交';
  }
};
// 表单配置
const formItems = ref([
  [
    {
      type: 'text',
      label: '商品编码',
      value: 'id',
      disabled: props.type && props.type === '1',
    },
    {
      type: 'text',
      label: '商品名称',
      value: 'name',
      rules: true,
    },
    {
      type: 'text',
      label: '商品别名',
      value: 'aliasName',
      rules: true,
    },
    {
      type: 'cascader',
      label: '商品类型',
      value: 'categoryIds',
      options: [],
      rules: true,
      changeOnSelect: true,
    },
  ],
  [
    {
      type: 'select',
      label: '单位',
      value: 'unit',
      options: [],
      rules: true,
    },
    {
      type: 'text',
      label: '描述',
      value: 'unitDescription',
      rules: true,
    },
    {
      type: 'number',
      label: '起订量',
      value: 'minimumOrderQuantity',
    },
  ],
  [
    {
      type: 'number',
      label: '商品排序',
      value: 'g_sort',
      rules: true,
      min: 0,
    },
    {
      type: 'text',
      label: '商品品牌',
      value: 'brand',
      rules: true,
    },
    {
      type: 'text',
      label: '商品产地',
      value: 'locality',
      rules: true,
    },
    {
      type: 'text',
      label: '商品参数',
      value: 'parameter',
      rules: true,
    },
    {
      type: 'datepicker',
      label: '上架日期',
      value: 'onShelfTime',
      rules: true,
      valueFormat: 'YYYY-MM-DD',
    },
  ],
]);

const dataSource = reactive({
  skus: [],
});

const formData = ref(new Array(formItems.value.length).fill([]));

onMounted(() => {
  // 组装默认的formData
  setupPage();
  getCategoryList();
  const tempList = [];
  formItems.value.forEach((child) => {
    const el = {};
    child.forEach((item) => {
      el[item.value] = undefined;
    });
    tempList.push(el);
  });
  formData.value = tempList;
  getDict();
  // 获取详情
  props.id && getDetail(props.id);
});

const getDetail = () => {
  loading.value = true;
  GoodsDetail(props.id)
    .then((res) => {
      formData.value.forEach((child) => {
        Object.keys(child).forEach((el) => {
          child[el] = res[el];
        });
      });

      const list = [];
      res.categoryVos.forEach((item) => {
        list.push(item.id);
      });
      formData.value[0].categoryIds = list;
      formData.value[2].g_sort = res.sort;

      dataSource.skus = res.skuVos;

      res.mainUrl &&
        (mainFileList.value = [
          {
            status: 'done',
            url: res.mainUrl,
          },
        ]);
    })
    .finally(() => {
      loading.value = false;
    });
};

const mainFileList = ref([]);
const mainUploading = ref(false);

// 上传图片的限制
const beforeUpload = (file) => {
  const isLt3M = file.size / 1024 / 1024 < 3;
  if (!isLt3M) {
    proxy.$message.error('图片不能大于3MB!');
  }
  return isLt3M;
};
// 主图和副图的添加删除
const handleMainRemove = () => {
  mainFileList.value = [];
};

const handleMainUpload = ({ file }) => {
  const imageData = new FormData();
  imageData.append('file', file);
  mainUploading.value = true;
  Upload(imageData)
    .then((res) => {
      mainFileList.value = [
        {
          status: 'done',
          url: res.url,
          name: res.originName,
        },
      ];
      mainUploading.value = false;
    })
    .catch((e) => {
      console.log(e);
      mainUploading.value = false;
      handleMainRemove();
      proxy.$message.error('图片上传失败，请重试');
    });
};

const previewVisible = ref(false);
const previewImage = ref('');

const handlePreview = (file) => {
  console.log(file);
  previewImage.value = file.url || file.preview;
  previewVisible.value = true;
};
const handleCancel = () => {
  previewVisible.value = false;
};

// 获取字典内容
const getDict = () => {
  getUnitDict().then((res) => {
    formItems.value[1][0].options = res.map((item) => ({
      label: item.dictKey,
      value: item.dictKey,
    }));
  });
};

// 提交保存
const submitLoading = ref(false);
const onFinish = () => {
  const { infoForm, skuForm, otherForm, unitForm, imgForm } = proxy.$refs;
  Promise.all([
    infoForm.validateFields(),
    skuForm.validate(),
    otherForm.validateFields(),
    unitForm.validateFields(),
    imgForm.validateFields(),
  ]).then((result) => {
    const info = result[0];
    const sku = result[1];
    const other = result[2];
    const unit = result[3];
    const files = result[4];

    const params = { ...info, sort: other.g_sort, ...other, ...unit, id: props.id };
    params.skuParams = sku.map((item) => ({
      id: item.id,
      attributeDTO: {
        key: item.skuKey,
        value: item.skuValue,
      },
      sort: item.sort,
      taxPoint: item.taxPoint,
      taxPrice: item.taxPrice,
    }));
    params.mainUrl = mainFileList.value ? mainFileList.value[0].url : undefined;
    params.categoryId = params.categoryIds[params.categoryIds.length - 1];
    if (isNaN(parseInt(params.categoryId, 10))) {
      params.categoryId = undefined;
    }
    params.categoryIds = undefined;
    console.log(params);
    const api = props.id ? UpdateGoods : AddGoods;
    const message = props.id ? '保存成功' : '提交成功';
    submitLoading.value = true;
    api(params)
      .then(() => {
        proxy.$message.success(message);
        proxy.$router.go(-1);
      })
      .finally(() => {
        submitLoading.value = false;
      });
  });
};

const getCategoryList = () => {
  categoryAll().then((res) => {
    const list = [];
    transformData(res, list);
    formItems.value[0][3].options = list;
  });
};

// 转换类目结构
const transformData = (list, result) => {
  if (list && list.length > 0) {
    list.forEach((item) => {
      const child = { label: item.name, value: item.id, children: [] };
      transformData(item.children, child.children);
      if (child.children.length <= 0) {
        delete child.children;
      }
      result.push(child);
    });
  }
};
</script>

<style lang="less" scoped>
.mainImgForm {
  padding: 0 32px 5px 32px;
}
</style>
