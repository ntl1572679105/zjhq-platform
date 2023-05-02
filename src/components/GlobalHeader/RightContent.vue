<template>
  <div class="header-content">
    <a @click.stop="showMessage">
      <a-badge :dot="messageDotShow">
        <img src="@/assets/images/icon-system-alarm@2x.png" width="24" />
      </a-badge>
    </a>
    <a-dropdown>
      <template #overlay>
        <a-menu>
          <a-menu-item @click="showPassowrd">
            <template #icon>
              <SettingOutlined />
            </template>
            <span>{{ $t('user.change.password') }}</span>
          </a-menu-item>
          <a-menu-item @click="handleLogout">
            <template #icon>
              <LogoutOutlined />
            </template>
            <span>{{ $t('user.logout') }}</span>
          </a-menu-item>
        </a-menu>
      </template>
      <div>
        <a-avatar shape="square" size="small">
          <template #icon>
            <UserOutlined />
          </template>
        </a-avatar>
        {{ currentUser.name }}
      </div>
    </a-dropdown>
    <ChangePassword ref="changePassword" />
    <MessageModal ref="messageModal" />
  </div>
</template>

<script setup>
import { getCurrentInstance, ref, onMounted } from 'vue';
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons-vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import ChangePassword from './ChangePassword.vue';
import { useI18n } from 'vue-i18n';
import { messageCount } from '@/api/message';
import MessageModal from '@/components/Message/index.vue';

const { dispatch, getters } = useStore();
const currentUser = { name: getters.userInfo.user.userName };
const router = useRouter();
const { proxy } = getCurrentInstance();
const { t } = useI18n();

const handleLogout = () => {
  proxy.$confirm({
    title: t('user.logout.warning'),
    content: t('user.logout.tips'),
    onOk: () => {
      dispatch('Logout').then(() => {
        router.push({ name: 'login' });
      });
    },
  });
};

const showPassowrd = () => {
  proxy.$refs.changePassword.show();
};

const messageDotShow = ref(false);
onMounted(() => {
  messageCount().then((res) => {
    messageDotShow.value = !!(res && res > 0);
  });
});

const showMessage = () => {
  proxy.$refs.messageModal.show();
};
</script>

<style lang="less" scoped>
.header-content {
  margin-right: 12px;
  //background-color: #131c25;
  display: flex;
  align-items: center;
  gap: 20px;
}
</style>
