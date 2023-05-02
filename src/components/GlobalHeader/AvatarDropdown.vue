<template>
  <div>
    <a-dropdown v-if="currentUser && currentUser.name" placement="bottomRight">
      <span class="ant-pro-account-avatar">
        <!-- <a-avatar
          size="small"
          src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
          class="antd-pro-global-header-index-avatar"
        /> -->
        <span>{{ currentUser.name }}</span>
      </span>
      <template v-slot:overlay>
        <a-menu class="ant-pro-drop-down menu" :selected-keys="[]">
          <a-menu-item v-if="menu" key="center" @click="openModal('userInfoSetting')">
            <a-icon type="setting" />
            个人信息设置
          </a-menu-item>
          <a-menu-divider v-if="menu" />
          <a-menu-item key="logout" @click="handleLogout">
            <a-icon type="logout" />
            登出
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
    <span v-else>
      <a-spin size="small" :style="{ marginLeft: 8, marginRight: 8 }" />
    </span>
    <!-- <UserInfoSetting ref="userInfoSetting" @openModal="openModal" />
    <ChangePassword ref="changePassword" /> -->
  </div>
</template>

<script>
import { Modal } from 'ant-design-vue';
import UserInfoSetting from './UserInfoSetting.vue';
import ChangePassword from './ChangePassword.vue';

export default {
  name: 'AvatarDropdown',
  components: {
    UserInfoSetting,
    ChangePassword,
  },
  props: {
    currentUser: {
      type: Object,
      default: () => null,
    },
    menu: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    openModal(refName) {
      this.$refs[refName].show();
    },
    handleLogout() {
      Modal.confirm({
        title: '提示',
        content: '内容',
        onOk: () => {
          // return new Promise((resolve, reject) => {
          //   setTimeout(Math.random() > 0.5 ? resolve : reject, 1500)
          // }).catch(() => console.log('Oops errors!'))
          return this.$store.dispatch('Logout').then(() => {
            this.$router.push({ name: 'login' });
          });
        },
        onCancel() {},
      });
    },
  },
};
</script>

<style lang="less" scoped>
.ant-pro-drop-down {
  :deep(.action) {
    margin-right: 8px;
  }
  :deep(.ant-dropdown-menu-item) {
    min-width: 160px;
  }
}
</style>
