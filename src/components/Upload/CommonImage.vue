<template>
  <n-upload
    v-model:file-list="state.previewFileList"
    list-type="image-card"
    :accept="accept"
    @before-upload="beforeUpload"
    :custom-request="selectImage"
    @remove="handleRemove"
    :max="max"
  />
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from 'vue';
import { Upload, getFileUrl } from '@/api/common';
import { useI18n } from 'vue-i18n';
const props = defineProps({
  list: {
    // 默认图片url list
    type: Array,
    default: () => [],
  },
  signList: {
    // 默认图片url list
    type: Array,
    default: () => [],
  },
  max: {
    // 图片最多几张
    type: Number,
    default: 9,
  },
  accept: {
    // 支持的格式
    type: String,
    default: 'image/png,image/jpg,image/jpeg',
  },
  maxSize: {
    // 单张图片最大
    type: Number,
    default: 20,
  },
  needCropper: {
    type: Boolean,
    default: false,
  },
});
const { proxy } = getCurrentInstance();
const emits = defineEmits(['finish']);
const { t } = useI18n();

const state = reactive({
  pictureUrlList: [],
  signUrlList: [],
  previewFileList: [],
});

onMounted(() => {
  console.log(props.list);
  state.pictureUrlList = props.list;
  state.signUrlList = props.signList;
  state.previewFileList = props.list.map((item) => ({
    id: Math.random(),
    name: item,
    status: 'finished',
    url: item,
  }));
});

const beforeUpload = (data) => {
  const maxSize = props.maxSize * 1024 * 1024; // 10M
  if (data.file.file?.size > maxSize) {
    window.$message.error(t('product.image.limit'));
    return false;
  }
  if (props.needCropper) {
    // console.log(data.file,'file');
    // proxy.$refs.imageCropper.show(data.file.file);
    return false;
  }
  return true;
};
const blobToFile = (blob, fileName) => {
  console.log(blob, 'blob');
  const file = new File([blob], blob.name, { type: blob.type });
  return file;
};
const cropperFinish = (blob) => {
  const file = blobToFile(blob);
  console.log(file, 'file');
  const formData = new FormData();
  formData.append('file', file);
  Upload(formData).then((res) => {
    state.signUrlList.push(res);
    submit();
    getFileUrl({ key: res }).then((result) => {
      state.previewFileList.push({
        name: file.name,
        status: 'finished',
        url: result,
      });
    });
  });
};
const selectImage = ({ file, data, onFinish, onError }) => {
  const formData = new FormData();
  if (data) {
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
  }
  //   formData.append(file.name, file.file);
  formData.append('file', file.file);
  file.status = 'uploading';
  Upload(formData)
    .then((res) => {
      state.signUrlList.push(res);
      submit();
      getFileUrl({ key: res })
        .then((result) => {
          file.url = result;
          state.pictureUrlList.push(result);
        })
        .finally(() => {
          file.status = 'finished';
          onFinish();
        });
    })
    .catch(() => {
      file.status = 'error';
      onError();
    });
};

const handleRemove = ({ file }) => {
  const index = state.pictureUrlList.findIndex((item) => item === file.url);
  if (index > -1) {
    state.signUrlList.splice(index, 1);
    state.pictureUrlList.splice(index, 1);
    submit();
  }
};

const submit = () => {
  emits('finish', state.signUrlList);
};
</script>

<style lang="less" scoped></style>
