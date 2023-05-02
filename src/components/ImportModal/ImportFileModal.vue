<template>
  <a-modal
    :title="importStepsData.title"
    :width="420"
    v-model:visible="visible"
    :confirm-loading="loading"
    destroy-on-close
    cancel-text
    @ok="submitData"
    @cancel="visible = false"
  >
    <a-spin :spinning="loading">
      <div>
        <div style="margin-bottom: 20px">
          <span style="margin-right: 10px">下载模版</span>
          <a href="./导入商品模板.xlsx" download="导入商品模板.xlsx">模板下载</a>
          <!--           <a-button @click="tapDown"> <download-outlined />模板下载 </a-button>-->
        </div>
        <div style="margin-bottom: 20px">提示: 请按模板规定格式填写内容，否则将导入失败</div>
        <div>
          <span style="margin-right: 10px">选择模板</span>
          <a-upload
            v-model:file-list="fileList"
            :custom-request="handleUpload"
            :name="importStepsData.uploadName"
            :before-upload="beforeUpload"
            :accept="importStepsData.accept"
            @remove="handleRemove"
          >
            <a-button v-if="!fileList.length">
              <UploadOutlined></UploadOutlined>
              选择文件上传
            </a-button>
          </a-upload>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
// import { ACCESS_TOKEN } from '@/store/mutation-types';
// import storage from 'store';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons-vue';
import { cloneDeep } from 'lodash';
// import {download, Upload} from '@/api/common.js';
import { importGoods } from '@/api/goods';

export default {
  name: 'ImportFileModal',
  props: {
    // type: {
    //   type: String,
    //   require: true,
    //   default: 'processor',
    //   validator (value) {
    //     return ['processor', 'device'].includes(value)
    //   }
    // }
  },
  components: {
    UploadOutlined,
    DownloadOutlined,
  },
  data() {
    return {
      importStepsData: { title: '导入', uploadName: 'file', accept: '.xls,.xlsx' },
      fileList: [],
      visible: false,
      loading: false,
    };
  },
  methods: {
    show(data) {
      this.visible = true;
      this.fileList = [];
      this.importStepsData = cloneDeep(data);
    },
    handleUpload({ file }) {
      console.log(typeof file, 'file');
      // const formData = new FormData();
      // formData.append('file', file);
      // console.log(formData, 'formData');
      this.fileList = [file];

      // importGoods(formData).then(res=>{
      //   this.$emit('finished',res)
      //   // this.visible = false
      // })
    },
    beforeUpload(file) {
      // this.fileList = [...this.fileList, file];
      // return false;
      return true;
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
    },
    submitData() {
      const { fileList } = this;
      if (!fileList.length) {
        return this.$message.error('请先上传文件');
      }
      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append('file', file);
      });
      importGoods(formData)
        .then((res) => {
          // console.log(res);
          this.visible = false;
          this.$emit('finished', res);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 模板下载
    tapDown() {
      const xlsx = document.createElement('a');
      xlsx.href = `${import.meta.env.VITE_APP_API_BASE_URL}/导入商品模板.xlsx`;
      xlsx.setAttribute('download', '导入商品模板.xlsx');
      xlsx.click();
    },
    downloadFile(data, fileName) {
      const blob = new Blob([data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(link.href);
    },
  },
};
</script>

<style lang="less" scoped>
.fileList-w {
  margin-top: 14px;
  .fileList-c {
    margin-bottom: 8px;
    border: 1px solid #6ac0f9;
    border-radius: 4px;
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    .close {
      color: red;
    }
  }
}
</style>
