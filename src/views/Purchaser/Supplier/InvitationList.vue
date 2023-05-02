<template>
  <PageContainer>
    <div>
      <CommonTitleAction title="邀请列表">
        <template #right>
          <a-space>
            <a-button type="primary" :loading="invitationLoading" @click="invitationCodeAdd()"
              >新增邀请码</a-button
            >
          </a-space>
        </template>
      </CommonTitleAction>
      <TableSearch
        ref="tableRef"
        :formItems="formItems"
        :formData="formData"
        :columns="columns"
        :scroll="{ x: 900 }"
        :api="invitationCodeList"
      >
        <template #cell="{ column, record, index, text }">
          <template v-if="column.dataIndex === 'status'">
            <span>{{ statusName(text) }}</span>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a v-if="record.status === 0" @click="codeCopy(record)">使用</a>
              <a style="color: orangered" @click="deleteCode(record)">删除</a>
            </a-space>
          </template>
        </template>
      </TableSearch>
      <InvitationModal ref="invitationModal" />
    </div>
  </PageContainer>
</template>

<script setup>
import { getCurrentInstance, computed, ref, createVNode } from 'vue';
import CommonTitleAction from '@/components/CommonTitleAction/index.vue';
import TableSearch from '@/components/TableSearch/index.vue';
import { invitationCodeList, invitationAdd, invitationDelete } from '@/api/operator/supplier.js';
import { message, Modal } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { useClipboard } from '@vueuse/core';
import InvitationModal from './components/InvitationModal.vue';

const { proxy } = getCurrentInstance();
const { copy } = useClipboard();

const formItems = ref([
  {
    type: 'text',
    label: '邀请码',
    value: 'id',
  },
  {
    type: 'select',
    label: '认证状态',
    value: 'status',
    options: [
      { label: '未使用', value: 0 },
      { label: '已使用', value: 1 },
    ],
  },
]);

const formData = {
  id: undefined,
  status: undefined,
};

const columns = [
  {
    title: '邀请码',
    dataIndex: 'id',
    width: 200,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 120,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 180,
  },
  {
    title: '创建人',
    dataIndex: 'createBy',
    width: 180,
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    width: 220,
  },
];

const statusName = computed(() => {
  return (value) => {
    return value ? '已使用' : '未使用';
  };
});

const invitationLoading = ref(false);

const codeCopy = (record) => {
  const text = `${location.origin}${location.pathname}#/purchaser/supplier/Register/${record.id}`;
  proxy.$refs.invitationModal.show({ url: text });
  copy(text).then(() => {
    message.success('已成功将邀请码复制到剪贴板，请发给供应商填写！');
  });
};

const deleteCode = (record) => {
  Modal.confirm({
    title: '删除确认',
    content: '确认删除？',
    okText: '确认',
    icon: createVNode(ExclamationCircleOutlined),
    cancelText: '取消',
    onOk: () => {
      invitationDelete(record.id).then(() => {
        message.success('邀请码删除成功');
        proxy.$refs.tableRef.refresh();
      });
    },
  });
};
const invitationCodeAdd = () => {
  invitationLoading.value = true;
  invitationAdd()
    .then(() => {
      message.success('邀请码新增成功');
      proxy.$refs.tableRef.refresh();
    })
    .finally(() => {
      invitationLoading.value = false;
    });
};
</script>

<style lang="less" scoped></style>
