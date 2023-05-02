<template>
  <a-modal
    v-model="visible"
    title="个人信息设置"
    @cancel="handleCancel"
    destroy-on-close
    :width="500"
  >
    <template #footer>
      <a-button key="back" @click="handleCancel"> 取消 </a-button>
      <!-- <a-button key="submit" type="primary" :loading="loading" @click="changeAvatar(userInfoSeting.avatar)"> -->
      <a-button key="submit" type="primary" :loading="loading" @click="changeAvatar()">
        确定
      </a-button>
    </template>
    <a-form-model
      ref="form"
      :model="userInfo"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      label-align="right"
    >
      <a-form-model-item label="账号">
        {{ userInfo.nickName || userInfo.userName }}
      </a-form-model-item>
      <a-form-model-item label="密码">
        ******<a class="margin-left" @click="showModal('changePassword')"> 修改密码 </a>
      </a-form-model-item>
      <a-form-model-item label="头像">
        <a-upload
          class="upload-file"
          :action="api"
          :headers="headers"
          @change="handleChange"
          :before-upload="handleBefore"
          accept=".jpg,.jpeg,.gif,.png,.bmp"
          :show-upload-list="false"
        >
          <div v-if="imgUrl">
            <a-avatar :size="60" :src="imgUrl" />
            <a style="padding-left: 10px">重新上传</a>
          </div>
          <div v-else class="add-plus">
            <a-icon type="plus" />
          </div>
        </a-upload>
        <div class="tips">图片支持jpg、jpeg、png、gif、bmp格式，最大不超过10M</div>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { mapGetters } from 'vuex';
import { ACCESS_TOKEN } from '@/store/mutation-types';
import storage from 'store';

export default {
  data() {
    return {
      loading: false,
      visible: false,
      labelCol: { xs: 24, md: 4 },
      wrapperCol: { xs: 24, md: 18 },
      imgUrl: '',
      api: `${import.meta.env.VITE_APP_API_BASE_URL}/common/file/upload`,
      headers: {
        Authorization: storage.get(ACCESS_TOKEN),
      },
    };
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  watch: {
    // userInfo: {
    //   handler (val) {
    //     // console.log(val)
    //     // this.userInfoSeting = _.cloneDeep(val)
    //     // this.imgUrl = val.avatar
    //   },
    //   immediate: true,
    //   deep: true
    // }
  },
  methods: {
    // ...mapMutations(['SET_INFO']),
    show() {
      this.visible = true;
    },
    uploadSuccess(data) {
      this.imgUrl = data.url;
      this.hasDone = true;
    },
    changeAvatar() {
      // if (!this.hasDone) {
      if (!this.imgUrl) {
        return this.$message.info('您尚未选择头像');
      }
      this.loading = true;
      //   userAccountApi.changeAvatar({ avatar: this.imgUrl }).then(res => {
      //     this.$message.success('头像更换成功')
      //     this.userInfoSeting.avatar = this.imgUrl
      //     this.loading = false
      //     this.SET_INFO(this.userInfoSeting)
      //     this.handleCancel()
      //   })
    },
    showModal(name) {
      this.visible = false;
      this.$emit('openModal', name);
    },
    handleCancel() {
      this.visible = false;
    },
    // 照片处理
    handleBefore(file) {
      const fileSize = file.size / 1024 / 1024;
      if (fileSize > 10) {
        this.$message.error(`图片大小不能超过10M!`);
        return false;
      }
      return true;
    },
    handleChange({ fileList, file }) {
      console.log(fileList);
      if (file.status === 'done') {
        const { data } = file.response;
        // console.log(data)
        // fileUrl/fileName
        this.imgUrl = data.fileUrl;
      }
    },
  },
};
</script>

<style lang="less" scoped>
:deep(.ant-form-item) {
  margin-bottom: 10px;
}
.add-plus {
  width: 60px;
  height: 60px;
  background: #fbfbfb;
  border-radius: 30px;
  border: 1px solid #dfdfdf;
  text-align: center;
  line-height: 60px;
  font-size: 25px;
  cursor: pointer;
}
.tips {
  font-size: 12px;
  color: #999;
}
</style>
