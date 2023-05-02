<template>
  <a-modal
    v-model:visible="visible"
    :title="state.title"
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
      <a-form-item label="合同类别" name="parentId">
        <a-select
          v-model:value="formState.parentId"
          placeholder="请选择"
          :options="state.options"
          :disabled="state.type === 1"
        />
      </a-form-item>
      <a-form-item label="合同名称" name="name">
        <a-input v-model:value="formState.name" placeholder="请输入" :disabled="state.type === 1" />
      </a-form-item>
      <a-form-item label="创建人" name="person">
        <a-input
          v-model:value="formState.person"
          placeholder="请输入"
          :disabled="state.type === 1"
        />
      </a-form-item>
      <a-form-item label="附件" name="documentUrl">
        <a-upload
          v-model:file-list="fileList"
          :customRequest="handleUpload"
          :before-upload="beforeUpload"
          @remove="handleRemove"
          :disabled="state.type === 1"
        >
          <a-button :loading="uploading" v-if="fileList.length < 1">
            <upload-outlined></upload-outlined>
            上传附件
          </a-button>
        </a-upload>
      </a-form-item>
      <a-form-item label="启用状态" name="status">
        <a-switch
          v-model:checked="formState.status"
          :disabled="state.type === 1"
          :checkedValue="0"
          :unCheckedValue="1"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { contractCategoryAdd, contractCategoryEdit } from '@/api/operator/contract';
import { reactive, ref, getCurrentInstance } from 'vue';
import { Upload } from '@/api/common.js';
import { UploadOutlined } from '@ant-design/icons-vue';

export default {
  components: {
    UploadOutlined,
  },
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const formRef = ref();
    const formState = reactive({
      id: undefined,
      parentId: undefined,
      status: 0,
      name: '',
      person: '',
      documentUrl: '',
    });
    const rules = {
      name: [{ required: true, message: '请输入' }],
      person: [{ required: true, message: '请输入' }],
      documentUrl: [{ required: true, message: '请上传' }],
      parentId: [{ required: true, message: '请选择' }],
    };

    const loading = ref(false);
    const visible = ref(false);
    const state = reactive({
      title: '',
      type: 0, // 0：新增 1：查看 2：编辑
      options: [], // 分类
    });

    const show = (item, type, options) => {
      visible.value = true;
      Object.keys(formState).forEach((key) => {
        formState[key] = item[key] ?? undefined;
      });
      state.type = type;
      state.title = ['新建合同', '查看合同', '编辑合同'][type];
      state.options = options;

      fileList.value = item.documentUrl
        ? [
            {
              status: 'done',
              url: item.documentUrl,
              name: item.documentUrl.split('/').pop(),
            },
          ]
        : [];
    };

    const uploading = ref(false);
    const fileList = ref([]);

    const handleRemove = (file) => {
      const index = fileList.value.indexOf(file);
      const newFileList = fileList.value.slice();
      newFileList.splice(index, 1);
      fileList.value = newFileList;
      formState.documentUrl = '';
    };

    const beforeUpload = (file) => {
      const isLt20M = file.size / 1024 / 1024 < 50;
      if (!isLt20M) {
        proxy.$message.error('附件不能大于50MB!');
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
          formState.documentUrl = res.url;
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
    };
    const handleOk = () => {
      formRef.value.validateFields().then((values) => {
        loading.value = true;
        const api = values.id ? contractCategoryEdit : contractCategoryAdd;
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
      state,
      uploading,
      fileList,
      show,
      handleCancel,
      handleOk,
      handleRemove,
      beforeUpload,
      handleUpload,
    };
  },
};
</script>
