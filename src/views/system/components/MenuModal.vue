<template>
  <a-modal
    v-model:visible="visible"
    :title="formState.title"
    :closable="false"
    @cancel="handleCancel"
    :destroy-on-close="true"
    :width="600"
    @ok="handleOk"
  >
    <template #footer>
      <a-button key="back" @click="handleCancel"> {{ $t('global.cancel') }} </a-button>
      <a-button key="submit" :loading="loading" type="primary" @click="handleOk">{{
        $t('gloabl.submit')
      }}</a-button>
    </template>
    <a-form
      ref="formRef"
      :model="formState"
      :label-col="currentLang === 'zh_CN' ? { xs: 24, md: 5 } : { xs: 24, md: 7 }"
      :wrapper-col="{ xs: 24, md: 14 }"
      label-align="right"
    >
      <a-form-item :label="$t('menu.system.menuId')" name="id" style="display: none">
        <a-input v-model:value="formState.id" />
      </a-form-item>
      <a-form-item :label="$t('menu.system.parentId')" name="parentId">
        <a-cascader
          v-model:value="formState.parentId"
          :options="menuOptions"
          change-on-select
          :placeholder="$t('form.search.select-placeholder')"
        />
      </a-form-item>
      <a-form-item
        :label="$t('menu.system.menuType')"
        name="menuType"
        :rules="{ required: true, message: $t('form.search.select-placeholder') }"
      >
        <a-select
          v-model:value="formState.menuType"
          :placeholder="$t('form.search.select-placeholder')"
        >
          <a-select-option v-for="(item, index) in typeOptions" :key="index" :value="item.value">{{
            $t(item.label)
          }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        :label="$t('menu.system.menuName')"
        name="menuName"
        style="display: none"
        :rules="{ required: true, message: $t('form.search.input-placeholder') }"
      >
        <a-input
          v-model:value="formState.menuName"
          :placeholder="$t('form.search.input-placeholder')"
        ></a-input>
      </a-form-item>
      <a-form-item
        :label="$t('menu.system.remark')"
        name="remark"
        :rules="{ required: true, message: $t('form.search.input-placeholder') }"
      >
        <a-input
          v-model:value="formState.remark"
          :placeholder="$t('form.search.input-placeholder')"
        ></a-input>
      </a-form-item>
      <a-form-item :label="$t('menu.system.orderNum')" name="orderNum">
        <a-input-number
          :precision="0"
          v-model:value="formState.orderNum"
          :placeholder="$t('form.search.input-placeholder')"
          style="width: 100%"
        />
      </a-form-item>
      <a-form-item :label="$t('menu.system.frame')" name="frame">
        <a-switch v-model:checked="formState.frame" :checkedValue="1" :unCheckedValue="0" />
      </a-form-item>
      <a-form-item
        :label="$t('menu.system.perms')"
        name="perms"
        :rules="{ required: true, message: $t('form.search.input-placeholder') }"
      >
        <a-input
          v-model:value="formState.perms"
          :placeholder="$t('form.search.input-placeholder')"
        ></a-input>
      </a-form-item>
      <a-form-item :label="$t('menu.system.path')" name="path">
        <a-input
          v-model:value="formState.path"
          :placeholder="$t('form.search.input-placeholder')"
        ></a-input>
      </a-form-item>
      <a-form-item :label="$t('menu.system.visible')" name="visible">
        <a-switch v-model:checked="formState.visible" :checkedValue="0" :unCheckedValue="1" />
      </a-form-item>
      <a-form-item :label="$t('menu.system.menuStatus')" name="status">
        <a-switch v-model:checked="formState.status" :checkedValue="0" :unCheckedValue="1" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { computed, reactive, ref } from 'vue';
import { menuAdd, menuEdit } from '@/api/menu.js';
import { useI18n } from 'vue-i18n';
import store from '@/store';

export default {
  setup(props, { emit }) {
    const { t } = useI18n();
    const formRef = ref();
    const currentLang = computed(() => {
      return store.getters.lang;
    });
    const formState = reactive({
      title: t('global.add'),
      id: undefined,
      parentId: null,
      menuType: undefined,
      menuName: '',
      remark: '',
      perms: '',
      path: '',
      orderNum: '',
      frame: 0,
      visible: 0,
      status: 0,
    });

    const menuOptions = ref([]);
    const typeOptions = [
      { label: 'menu.system.directory', value: 'M' },
      { label: 'menu.system.menu', value: 'C' },
      { label: 'menu.system.interface', value: 'F' },
    ];

    const visible = ref(false);
    const loading = ref(false);

    const show = (item) => {
      visible.value = true;
      Object.keys(formState).forEach((key) => {
        formState[key] = item[key] || undefined;
      });
      console.log(formState, 'formstate');
      formState.visible = item.visible || 0;
      formState.status = item.status || 0;
      formState.frame = item.frame || 0;
      formState.orderNum = item.orderNum;
      formState.menuName = item.menuName ?? new Date().toISOString();
      if (item.menuIds) {
        formState.parentId = item.menuIds;
      } else {
        formState.parentId = null;
      }
      const menus = [];
      filterMenusFn(item.menus, menus);
      console.log(menus, 'menus');
      menuOptions.value = menus;
    };
    // 对父级菜单label中英文切换
    const filterMenusFn = (list, tree) => {
      if (list.length <= 0) return;
      list.forEach((item) => {
        const result = {
          ...item,
          label: currentLang.value === 'zh_CN' ? item.label_ch : t(item.label_en),
        };
        if (item.children && item.children.length > 0) {
          const temps = [];
          filterMenusFn(item.children, temps);
          result.children = temps;
        }
        tree.push(result);
      });
    };
    // 按钮操作
    const handleCancel = () => {
      formRef.value.resetFields();
      visible.value = false;
      emit('reset');
    };
    const handleOk = () => {
      formRef.value.validateFields().then((values) => {
        console.log(values, 'values');
        loading.value = true;
        const api = values.id ? menuEdit : menuAdd;
        const params = { ...values };
        if (values.parentId && values.parentId.length > 0) {
          params.parentId = values.parentId[values.parentId.length - 1];
        } else {
          params.parentId = 0;
        }
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
      currentLang,
      formRef,
      formState,
      visible,
      loading,
      menuOptions,
      typeOptions,
      show,
      handleCancel,
      handleOk,
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
