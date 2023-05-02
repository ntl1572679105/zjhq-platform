<template>
  <PageContainer>
    <div>
      <TableSearch
        ref="tableRef"
        :formItems="formItems"
        :formData="formData"
        :columns="columns"
        :scroll="{ x: 1040 }"
        :api="configList"
      >
        <template #action>
          <a-space class="mb-20">
            <a-button type="primary" @click="handleAdd" v-permission="['sys:config:add']"
              >新增</a-button
            >
          </a-space>
        </template>
        <template #cell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="handleEdit(record)" v-permission="['sys:config:edit']">编辑</a>
              <a
                @click="deleteSub(record)"
                style="color: #ff4d4f"
                v-permission="['sys:config:remove']"
                >删除</a
              >
            </a-space>
          </template>
          <template v-else-if="column.key === 'configType'">
            {{ configTypeName(text) }}
          </template>
        </template>
      </TableSearch>
      <ConfigModal ref="configModal" @finish="modalOk" />
    </div>
  </PageContainer>
</template>

<script setup>
import { getCurrentInstance, computed } from 'vue';
import TableSearch from '@/components/TableSearch/index.vue';
import { configList, configDelete, configDetail } from '@/api/erp/config.js';
import ConfigModal from './components/ConfigModal.vue';

const { proxy } = getCurrentInstance();

const formItems = [
  {
    type: 'text',
    label: '配置名称',
    value: 'configName',
  },
  {
    type: 'text',
    label: '配置键名',
    value: 'configKey',
  },
];

const formData = {
  configKey: undefined,
  configName: undefined,
};

const columns = [
  {
    title: '序号',
    customRender: ({ index }) => `${index + 1}`,
    width: 80,
  },
  {
    title: '配置类型',
    dataIndex: 'configType',
    key: 'configType',
    width: 120,
  },
  {
    title: '配置名称',
    dataIndex: 'configName',
    width: 180,
    ellipsis: true,
  },
  {
    title: '配置键名',
    dataIndex: 'configKey',
    width: 180,
    ellipsis: true,
  },
  {
    title: '配置键值',
    dataIndex: 'configValue',
    width: 180,
    ellipsis: true,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 180,
    ellipsis: true,
  },
  {
    title: '操作',
    key: 'action',
    width: 120,
  },
];

const configTypeName = computed(() => {
  return (value) => {
    return ['系统内置', '业务配置'][value] || '-';
  };
});

const handleAdd = () => {
  proxy.$refs.configModal.show({ title: '新增' });
};
const handleEdit = (record) => {
  //   configDetail(record.id).then((res) => {
  proxy.$refs.configModal.show({ title: '编辑', ...record });
  //   });
};
const deleteSub = (record) => {
  proxy.$confirm({
    title: `确定删除?`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      configDelete(record.id).then(() => {
        proxy.$message.success('删除成功');
        proxy.$refs.tableRef.refresh();
      });
    },
  });
};
const modalOk = () => {
  proxy.$refs.tableRef.refresh();
};
</script>

<style lang="less" scoped></style>
