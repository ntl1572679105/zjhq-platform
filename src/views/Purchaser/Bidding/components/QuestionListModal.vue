<template>
  <a-modal v-model:visible="visible" title="澄清答疑" :destroy-on-close="true" :width="1000">
    <template #footer>
      <a-button key="submit" type="primary" @click="handleOk">关闭</a-button>
    </template>
    <CommonTable
      ref="questionTable"
      rowKey="id"
      :columns="columns"
      :params="{ bidId: bidId }"
      :api="bidQuestionPage"
    >
      <template #cell="{ column, record, index, text }">
        <template v-if="column.key === 'answer'">
          <span v-if="text">{{ text }}</span>
          <a v-else @click="handleEdit(record)">回复</a>
        </template>
      </template>
    </CommonTable>
    <QuesstionAnswerModal ref="quesstionAnswerModal" @finish="refresh" />
  </a-modal>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue';
import { bidQuestionPage } from '@/api/operator/bid';
import QuesstionAnswerModal from './QuesstionAnswerModal.vue';
import CommonTable from '@/components/CommonTable/index.vue';

defineProps({
  bidId: {
    type: String,
    required: true,
  },
});

const columns = [
  {
    title: '序号',
    customRender: ({ index }) => `${index + 1}`,
    width: '9%',
  },
  {
    title: '供应商名称',
    dataIndex: ['supplier', 'name'],
    width: '15%',
    align: 'center',
  },
  {
    title: '联系人',
    dataIndex: 'linkman',
    width: '15%',
    align: 'center',
  },
  {
    title: '联系方式',
    dataIndex: 'phone',
    align: 'center',
    width: '15%',
  },
  {
    title: '问题描述',
    dataIndex: 'description',
    align: 'center',
    width: '23%',
    ellipsis: true,
  },
  {
    title: '回复内容',
    key: 'answer',
    dataIndex: 'answer',
    width: '23%',
    align: 'center',
    ellipsis: true,
  },
];

const { proxy } = getCurrentInstance();
const visible = ref(false);

const show = () => {
  visible.value = true;
};

// 按钮操作
const handleOk = () => {
  visible.value = false;
};

const handleEdit = (record) => {
  proxy.$refs.quesstionAnswerModal.show(record);
};

const refresh = () => {
  proxy.$refs.questionTable.tableSearch();
};

defineExpose({
  show,
});
</script>
