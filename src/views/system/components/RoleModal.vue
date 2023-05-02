<template>
  <a-modal
    v-model:visible="visible"
    :title="formState.title"
    @cancel="handleCancel"
    :destroy-on-close="true"
    :width="600"
    @ok="handleOk"
  >
    <template #footer>
      <a-button key="back" @click="handleCancel"> {{ $t('global.cancel') }} </a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="handleOk">{{
        $t('gloabl.submit')
      }}</a-button>
    </template>
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="currentLang === 'zh_CN' ? { xs: 24, md: 5 } : { xs: 24, md: 7 }"
      :wrapper-col="{ xs: 24, md: 14 }"
      label-align="right"
    >
      <a-form-item :label="$t('table.column.id')" name="id" style="display: none">
        <a-input v-model:value="formState.id" disabled />
      </a-form-item>

      <a-form-item :label="$t('menu.system.roleName')" name="roleName">
        <a-input
          v-model:value="formState.roleName"
          :placeholder="$t('form.search.input-placeholder')"
        />
      </a-form-item>
      <a-form-item :label="$t('menu.system.roleKey')" name="roleKey">
        <a-input
          v-model:value="formState.roleKey"
          :placeholder="$t('form.search.input-placeholder')"
        />
      </a-form-item>
      <a-form-item :label="$t('menu.system.roleSort-js')" name="roleSort">
        <a-input-number
          :precision="0"
          v-model:value="formState.roleSort"
          :placeholder="$t('form.search.input-placeholder')"
          style="width: 100%"
        />
      </a-form-item>
      <a-form-item :label="$t('menu.system.openStatus')" name="status">
        <a-switch v-model:checked="formState.status" :checkedValue="0" :unCheckedValue="1" />
      </a-form-item>
      <a-form-item :label="$t('menu.system.menuPer')" name="menuIds">
        <div class="custom-tree">
          <a-tree
            checkable
            check-strictly
            :tree-data="treeState.treeData"
            v-model:checkedKeys="treeState.checkedKeys"
            v-model:selectedKeys="treeState.selectedKeys"
          />
        </div>
      </a-form-item>
      <a-form-item :label="$t('global.note')" name="remark">
        <a-textarea
          v-model:value="formState.remark"
          :rows="4"
          :placeholder="$t('form.search.input-placeholder')"
          show-count
          :maxlength="300"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { roleAdd, roleEdit } from '@/api/role.js';
import { menuList } from '@/api/menu.js';
import { reactive, ref, getCurrentInstance, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import store from '@/store';

export default {
  setup(props, { emit }) {
    const { t, locale } = useI18n();
    const { proxy } = getCurrentInstance();
    const currentLang = computed(() => {
      return store.getters.lang;
    });
    const formRef = ref();
    const mapRef = ref(null);
    const formState = reactive({
      title: '',
      id: undefined,
      roleName: '',
      roleKey: '',
      roleSort: '',
      status: 0,
      menuIds: [],
      remark: '',
    });
    const rules = {
      roleName: [{ required: true, message: t('form.search.input-placeholder') }],
      roleKey: [{ required: true, message: t('form.search.input-placeholder') }],
      roleSort: [{ required: true, message: t('form.search.input-placeholder') }],
    };

    const loading = ref(false);
    const visible = ref(false);
    const treeState = reactive({
      treeData: [],
      checkedKeys: [],
      selectedKeys: [],
    });

    const show = (item) => {
      visible.value = true;
      Object.keys(formState).forEach((key) => {
        formState[key] = item[key] || undefined;
      });
      formState.status = item.status || 0;
      formState.roleSort = item.roleSort;
      if (item && item.menuList) {
        const tree = [];
        listToTree(item.menuList, tree);
        console.log(tree, 'tree');
        treeState.treeData = tree;
        treeState.checkedKeys = item.checkedIdList;
      } else {
        formState.menuIds = [];
        treeState.checkedKeys = [];
        getMenuList();
      }
    };

    // 获取菜单
    const getMenuList = () => {
      menuList().then((res) => {
        const tree = [];
        listToTree(res, tree);
        console.log(tree, 'tree');
        treeState.treeData = tree;
      });
    };
    const listToTree = (list, tree) => {
      if (list.length <= 0) return;
      list.forEach((item) => {
        const result = {
          title: locale.value === 'en_US' ? t(item.menuName) : item.remark,
          key: item.id,
        };
        if (item.children && item.children.length > 0) {
          const temps = [];
          listToTree(item.children, temps);
          result.children = temps;
        }
        tree.push(result);
      });
    };

    // 按钮操作
    const handleCancel = () => {
      formRef.value.resetFields();
      visible.value = false;
    };
    const handleOk = () => {
      formRef.value.validateFields().then((values) => {
        const params = { ...values };
        params.menuIds = treeState.checkedKeys.checked
          ? treeState.checkedKeys.checked
          : treeState.checkedKeys;
        loading.value = true;
        const api = values.id ? roleEdit : roleAdd;
        const content = values.id ? t('global.modify.success') : t('global.add.success');
        api(params)
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
      currentLang,
      formRef,
      mapRef,
      formState,
      rules,
      treeState,
      loading,
      visible,
      show,
      handleCancel,
      handleOk,
      listToTree,
    };
  },
};
</script>

<style lang="less" scoped>
.custom-tree {
  background-color: #ebf4ff;
  height: 200px !important;
  overflow: scroll;
}
:deep(.ant-tree) {
  background-color: #ebf4ff;
}
</style>
