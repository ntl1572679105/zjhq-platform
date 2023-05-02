<template>
  <PageContainer>
    <a-card :bordered="false">
      <div class="table-operator" v-permission="['system:menu:add']">
        <!--      <div class="table-operator">-->
        <a-button type="primary" @click="handleAdd"> {{ $t('menu.system.addMenu') }} </a-button>
      </div>
      <a-table
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource.list"
        :loading="loading"
      >
        <template #headerCell="{ title, column }">
          <span>{{ $t(title) }}</span>
        </template>
        <template #bodyCell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a v-if="record.menuType !== 'F'" @click="handleAdd(record)">{{
                $t('global.add')
              }}</a>
              <a @click="handleEdit(record)">{{ $t('global.edit') }}</a>
              <a @click="deleteSub(record)" style="color: #ff4d4f">{{ $t('global.delete') }}</a>
              <!--              <a @click="handleEdit(record)" v-permission="['system:menu:edit']">编辑</a>-->
              <!--              <a-->
              <!--                @click="deleteSub(record)"-->
              <!--                style="color: #ff4d4f"-->
              <!--                v-permission="['system:menu:remove']"-->
              <!--              >删除</a-->
              <!--              >-->
            </a-space>
          </template>
          <template v-if="column.key === 'menuName'">
            {{ menuNameText(record) }}
          </template>
          <template v-if="column.key === 'status'">
            {{ textStatus(text) }}
          </template>
        </template>
      </a-table>
      <MenuModal ref="menuModal" @finish="modalOk" />
    </a-card>
  </PageContainer>
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance, computed } from 'vue';
import MenuModal from './components/MenuModal.vue';
import { menuList, menuDelete } from '@/api/menu';
import { useI18n } from 'vue-i18n';

const { proxy } = getCurrentInstance();
const { t, locale } = useI18n();
const columns = [
  {
    title: 'menu.system.menuName',
    // dataIndex: 'menuName',
    key: 'menuName',
  },
  {
    title: 'menu.system.orderNum',
    dataIndex: 'orderNum',
  },
  {
    title: 'menu.system.perms',
    dataIndex: 'perms',
  },
  {
    title: 'global.status',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: 'global.createTime-cj',
    dataIndex: 'createTime',
  },
  {
    title: 'global.operate',
    dataIndex: 'action',
    key: 'action',
  },
];

const textStatus = computed(() => {
  return (value) => {
    return [t('global.status.normal'), t('global.status.disable')][value];
  };
});

const menuNameText = computed(() => {
  return (record) => {
    return locale.value === 'en_US' ? t(record.menuName) : record.remark;
  };
});

const loading = ref(false);
const dataSource = reactive({
  list: [],
  params: {},
});
onMounted(() => {
  getList();
});

const getList = () => {
  loading.value = true;
  menuList()
    .then((res) => {
      const list = res;
      menuDataClean(list, []);
      dataSource.list = list;
    })
    .finally(() => {
      loading.value = false;
    });
};

// 菜单数据清理：1.删除空children 2.赋值级联菜单ids
const menuDataClean = (list, parentMenuIds) => {
  list.forEach((item) => {
    item.menuIds = [...parentMenuIds, item.id];
    item.label_en = item.menuName;
    item.label_ch = item.remark;
    item.value = item.id;
    if (item.children) {
      if (item.children.length === 0) {
        delete item.children;
      } else {
        menuDataClean(item.children, item.menuIds);
      }
    }
  });
};

const deleteEmptyChildren = (list) => {
  list.forEach((item) => {
    if (item.children) {
      if (item.children.length === 0) {
        delete item.children;
      } else {
        deleteEmptyChildren(item.children);
      }
    }
  });
};
const deleteSub = (record) => {
  proxy.$confirm({
    title: `${t('menu.system.delMenu.confirm')}-${record.menuName}?`,
    okText: t('gloabl.submit'),
    okType: 'danger',
    cancelText: t('global.cancel'),
    onOk: () => {
      menuDelete(record.id).then(() => {
        proxy.$message.success(t('global.delete.success'));
        getList();
      });
    },
  });
};
const handleAdd = (record) => {
  proxy.$refs.menuModal.show({
    title: t('global.add'),
    menus: dataSource.list,
    menuIds: record ? record.menuIds : null,
  });
};
const handleEdit = (record) => {
  proxy.$refs.menuModal.show({
    title: t('global.modify'),
    ...record,
    menus: dataSource.list,
    menuIds: record.menuIds.slice(0, record.menuIds.length - 1),
  });
};
const modalOk = () => {
  getList();
};
</script>

<style lang="less" scoped></style>
