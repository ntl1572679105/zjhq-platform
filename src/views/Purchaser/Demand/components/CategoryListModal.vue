<template>
  <a-modal
    v-model:visible="visible"
    :title="formState.title"
    :closable="false"
    @cancel="handleCancel"
    :destroy-on-close="true"
    :width="600"
    centered
    @ok="handleOk"
    :z-index="988"
  >
    <template #footer>
      <a-button key="back" @click="handleCancel"> 取消 </a-button>
      <a-button key="submit" :loading="loading" type="primary" @click="handleOk">确定</a-button>
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
        <a-input v-model:value="formState.id" />
      </a-form-item>
      <a-form-item label="父级类目" name="parentId" v-if="formState.parentId !== '0'">
        <a-cascader
          :disabled="firstDisabled"
          v-model:value="formState.parentId"
          :options="menuOptions"
          change-on-select
          placeholder="请选择"
        />
      </a-form-item>
      <a-form-item label="类目名称" name="name">
        <a-input v-model:value="formState.name" placeholder="请输入"></a-input>
      </a-form-item>
      <a-form-item label="展示图片" name="imgUrl">
        <a-upload
          v-model:file-list="fileList"
          :customRequest="handleUpload"
          name="avatar"
          list-type="picture-card"
          class="avatar-uploader"
          accept="image/png, image/jpeg, image/jpg"
          :before-upload="beforeUpload"
          @remove="handleRemove"
          @preview="handlePreview"
        >
          <div v-if="fileList.length < 1">
            <loading-outlined v-if="uploading"></loading-outlined>
            <plus-outlined v-else></plus-outlined>

            <div class="ant-upload-text">上传</div>
          </div>
        </a-upload>
      </a-form-item>
      <a-form-item label="显示排序" name="sort">
        <a-input-number
          :precision="0"
          :min="0"
          :max="99999"
          v-model:value="formState.sort"
          placeholder="请输入"
          style="width: 100%"
        />
      </a-form-item>
      <a-form-item label="类目状态" name="status">
        <a-switch v-model:checked="formState.status" :checkedValue="0" :unCheckedValue="1" />
      </a-form-item>
    </a-form>
  </a-modal>
  <a-modal
    :visible="previewVisible"
    :footer="null"
    :z-index="999"
    @cancel="handleCancelImg"
    centered
    width="500px"
  >
    <img style="width: 100%" :src="previewImage" />
  </a-modal>
</template>

<script>
import { reactive, ref, getCurrentInstance } from 'vue';
import { categoryAdd, categoryEdit } from '@/api/operator/demand.js';
import { Upload } from '@/api/common.js';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';

export default {
  components: {
    PlusOutlined,
    LoadingOutlined,
  },
  emits: ['finish'],
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const formRef = ref();
    const formState = reactive({
      title: '添加',
      id: undefined,
      parentId: null,
      name: '',
      imgUrl: '',
      sort: 0,
      status: 0,
      add: '',
    });
    const rules = reactive({
      name: [{ required: true, message: '请输入名称' }],
      // imgUrl: [{ required: true, message: '请上传图片' }],
      // parentId: [{ required: true, message: '请上传选择类目' }],
    });
    const menuOptions = ref([]);
    const visible = ref(false);
    const uploading = ref(false);
    const loading = ref(false);
    const firstDisabled = ref(false);
    const fileList = ref([]);
    const show = (item) => {
      visible.value = true;
      Object.keys(formState).forEach((key) => {
        formState[key] = item[key] || undefined;
      });
      formState.sort = item.sort || 0;
      formState.status = item.status || 0;
      if (item.menuIds && item.menuIds.length > 0) {
        formState.parentId = item.menuIds;
        firstDisabled.value = false;
        rules.parentId = [{ required: true, message: '请上传选择类目' }];
      } else {
        formState.parentId = '0';
        firstDisabled.value = true;
        Object.keys(rules).forEach((key) => {
          if (key === 'parentId') {
            delete rules[key];
          }
        });
      }
      fileList.value = item.imgUrl
        ? [
            {
              status: 'done',
              url: item.imgUrl,
              name: item.imgUrl,
            },
          ]
        : [];
      menuOptions.value = item.menus;
    };

    // 图片操作
    const handleRemove = (file) => {
      const index = fileList.value.indexOf(file);
      const newFileList = fileList.value.slice();
      newFileList.splice(index, 1);
      fileList.value = newFileList;
      formState.imgUrl = '';
    };
    const previewVisible = ref(false);
    const previewImage = ref('');

    // // 预览图片  @preview="handlePreview"

    const handlePreview = (file) => {
      previewImage.value = file.url || file.preview;
      previewVisible.value = true;
    };
    const handleCancelImg = () => {
      previewVisible.value = false;
    };

    const beforeUpload = (file) => {
      const isLt20M = file.size / 1024 / 1024 < 20;
      if (!isLt20M) {
        proxy.$message.error('图片不能大于20MB!');
      }
      return isLt20M;
    };

    const handleUpload = ({ file }) => {
      const formData = new FormData();
      formData.append('file', file);
      uploading.value = true;
      Upload(formData)
        .then((res) => {
          fileList.value = [
            {
              status: 'done',
              url: res.url,
              name: res.originalName,
            },
          ];
          uploading.value = false;
          formState.imgUrl = res.url;
          formRef.value.validateFields();
        })
        .catch(() => {
          uploading.value = false;
          proxy.$message.error('图片上传失败，请重试');
        });
    };

    // 按钮操作
    const handleCancel = () => {
      formRef.value.resetFields();
      visible.value = false;
      // emit('reset');
    };
    const handleOk = () => {
      formRef.value.validateFields().then((values) => {
        loading.value = true;
        const api = values.id ? categoryEdit : categoryAdd;
        const params = { ...values, imgUrl: formState.imgUrl || '' };
        // if (values.parentId && values.parentId.length > 0) {
        //   params.parentId = values.parentId[values.parentId.length - 1];
        // } else {
        //   params.parentId = 0;
        // }
        console.log(formState, 'formState');
        params.parentId = formState.parentId
          ? formState.parentId[formState.parentId.length - 1]
          : 0;
        api(params)
          .then((res) => {
            emit('finish', res);
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
      visible,
      loading,
      rules,
      menuOptions,
      uploading,
      fileList,
      previewVisible,
      previewImage,
      firstDisabled,
      show,
      handleCancel,
      handleOk,
      handleRemove,
      beforeUpload,
      handleUpload,
      handlePreview,
      handleCancelImg,
    };
  },
};
</script>

<style lang="less" scoped>
.tips {
  font-size: 12px;
  color: gray;
}
</style>
