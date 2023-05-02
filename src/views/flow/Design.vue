<template>
  <PageContainer>
    <a-card :bordered="false">
      <a-skeleton active :loading="loading">
        <div class="justify-between align-center">
          <span class="f-24 f-blod">{{ state.detail.name }}</span>
          <a-button :loading="submitLoading" type="primary" size="large" @click.stop="onFinish"
            >保存</a-button
          >
        </div>
        <div class="flow-main">
          <div
            :class="['steps-box', item.type === 1 ? 'steps-start' : '']"
            v-for="(item, index) in state.detail.taskList"
            :key="index"
          >
            <span v-if="item.type === 1">{{ item.name }}</span>
            <div v-else class="steps-item" @click.stop="editStep(index, item)">
              <div>
                <span>节点名称：</span>
                <span>{{ item.name }}</span>
              </div>
              <div>
                <span>审批类型：</span>
                <span>{{ typeName(item.type) }}</span>
              </div>
              <div>
                <span>审批人类型：</span>
                <span>{{ assigneeTypeName(item.assigneeType) }}</span>
              </div>
              <div>
                <span>{{ item.assigneeType === 1 ? '审批人' : '审批角色' }}：</span>
                <span>{{ assigneeNames(item.assignee, item.assigneeType) }}</span>
              </div>
              <div class="steps-delete" @click.stop="deleteStep(index, item)">-</div>
            </div>
            <div class="steps-line"></div>
            <div class="steps-add" @click.stop="addStep(index, item)">+</div>
          </div>
          <div class="steps-end">结束</div>
        </div>
        <a-drawer v-model:visible="visible" size="large" title="节点信息" placement="right">
          <template #extra>
            <a-button style="margin-right: 8px" @click="onClose">关闭</a-button>
            <a-button type="primary" @click="onSubmit">确定</a-button>
          </template>
          <a-form
            ref="formRef"
            :model="curStepState"
            :rules="rules"
            :label-col="{ xs: 24, md: 5 }"
            :wrapper-col="{ xs: 24, md: 14 }"
            label-align="right"
          >
            <a-form-item label="节点名称" name="name">
              <a-input v-model:value="curStepState.name" placeholder="请输入" />
            </a-form-item>
            <a-form-item label="节点类型" name="type">
              <a-select
                v-model:value="curStepState.type"
                placeholder="请选择"
                allowClear
                :options="typeOptions"
              />
            </a-form-item>
            <a-form-item label="审批人类型" name="assigneeType">
              <a-select
                v-model:value="curStepState.assigneeType"
                placeholder="请选择"
                allowClear
                :options="assigneeTypeOptions"
                @change="assigneeTypeChange"
              />
            </a-form-item>
            <a-form-item v-if="curStepState.assigneeType === 1" label="审批人" name="assignee">
              <a-select
                v-model:value="curStepState.assignee"
                placeholder="请选择"
                mode="multiple"
                style="width: 100%"
                :max-tag-text-length="10"
                :options="state.users"
              />
            </a-form-item>
            <a-form-item
              v-else-if="curStepState.assigneeType === 2"
              label="审批角色"
              name="assignee"
            >
              <a-select
                v-model:value="curStepState.assignee"
                placeholder="请选择"
                allowClear
                :options="state.roles"
              />
            </a-form-item>
          </a-form>
        </a-drawer>
      </a-skeleton>
    </a-card>
  </PageContainer>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance, reactive, computed } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import { processDetail, processDesign } from '@/api/flow';
import { roleList, userList } from '@/api/erp/common.js';

const loading = ref(false);
const { proxy } = getCurrentInstance();
const props = defineProps({
  id: String,
});

// 详情/角色/人员
const state = reactive({
  detail: {},
  roles: [],
  users: [],
  isFinish: true,
});
// 单个编辑节点
const curState = reactive({
  index: 0,
  action: false, // false: 新增 ，true: 编辑
});
const curStepState = reactive({
  name: '',
  type: undefined,
  assigneeType: undefined,
  assignee: undefined,
});
const rules = {
  name: [{ required: true, message: '请输入' }],
  type: [{ required: true, message: '请选择' }],
  assigneeType: [{ required: true, message: '请选择' }],
  assignee: [{ required: true, message: '请选择' }],
};

const typeOptions = [
  { label: '会签任务', value: 2 },
  { label: '或签任务', value: 3 },
];
const assigneeTypeOptions = [
  { label: '指定用户', value: 1 },
  { label: '角色', value: 2 },
];

onMounted(() => {
  // 获取详情
  props.id && getDetail(props.id);
  getAllRoleAndUsers();
});

const getDetail = () => {
  loading.value = true;
  processDetail(props.id)
    .then((res) => {
      state.detail = res;
    })
    .finally(() => {
      loading.value = false;
    });
};

const getAllRoleAndUsers = () => {
  roleList().then((res) => {
    state.roles = res.map((item) => ({ label: item.roleName, value: item.id }));
  });
  userList().then((res) => {
    state.users = res.map((item) => ({ label: item.userName, value: item.id }));
  });
};

// 节点
const typeName = computed(() => {
  return (value) => {
    return ['', '发起任务', '会签任务', '或签任务'][value] || '-';
  };
});
const assigneeTypeName = computed(() => {
  return (value) => {
    return ['', '指定用户', '角色'][value] || '-';
  };
});
const assigneeNames = computed(() => {
  return (value, type) => {
    if (type === 1) {
      const list = [];
      value.split(',').forEach((el) => {
        const item = state.users.find((ob) => ob.value === el);
        item && list.push(item.label);
      });
      return list.join(',');
    } else if (type === 2) {
      return state.roles.find((item) => item.value === value)?.label ?? '-';
    } else {
      return '-';
    }
  };
});

const deleteStep = (index, item) => {
  state.detail.taskList.splice(index, 1);
  state.isFinish = false;
};

const addStep = (index, item) => {
  visible.value = true;
  curState.index = index;
  curState.action = false;
  Object.keys(curStepState).forEach((key) => {
    curStepState[key] = undefined;
  });
  state.isFinish = false;
};

const editStep = (index, item) => {
  curState.index = index;
  curState.action = true;
  visible.value = true;
  Object.keys(curStepState).forEach((key) => {
    curStepState[key] = item[key];
  });
  if (item.assigneeType === 1) {
    curStepState.assignee = item.assignee.split(',');
  }
  state.isFinish = false;
};

// 抽屉
const visible = ref(false);
const onClose = () => {
  visible.value = false;
};
const onSubmit = () => {
  proxy.$refs.formRef.validateFields().then((values) => {
    visible.value = false;
    if (curState.action) {
      state.detail.taskList[curState.index] = {
        name: values.name,
        type: values.type,
        assigneeType: values.assigneeType,
        assignee: Array.isArray(values.assignee) ? values.assignee.join(',') : values.assignee,
      };
    } else {
      state.detail.taskList.splice(curState.index + 1, 0, {
        name: values.name,
        type: values.type,
        assigneeType: values.assigneeType,
        assignee: Array.isArray(values.assignee) ? values.assignee.join(',') : values.assignee,
      });
    }
  });
};

const assigneeTypeChange = (value) => {
  curStepState.assignee = [];
};

// 提交保存
const submitLoading = ref(false);
const onFinish = () => {
  //   console.log(state.detail);
  const { taskList } = state.detail;
  taskList.forEach((item, index) => {
    item.level = index + 1;
  });
  submitLoading.value = true;
  processDesign({ id: props.id, taskList })
    .then(() => {
      proxy.$message.success('设置成功');
      state.isFinish = true;
      proxy.$router.go(-1);
    })
    .finally(() => {
      submitLoading.value = false;
    });
};

// 返回上一页拦截
onBeforeRouteLeave(async (to, from) => {
  // 无编辑可直接返回，有编辑则提示用户
  if (state.isFinish) return true;
  const answer = await new Promise((resolve, reject) => {
    proxy.$confirm({
      title: `当前添加或修改的数据未提交，返回将会丢失，是否确定返回?`,
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        resolve(true);
      },
      onCancel: () => {
        reject(false);
      },
    });
  });
  return answer;
});
</script>

<style lang="less" scoped>
.flow-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  border-top: 1px solid #e0e0e6;
  padding-top: 20px;
}
.steps-box {
  position: relative;
  display: flex;
  justify-content: center;
  width: 200px;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #1b77ff;
  margin-bottom: 60px;
  .steps-line {
    position: absolute;
    bottom: -60px;
    width: 1px;
    height: 60px;
    background: #c0c4cc;
    &::after {
      content: '';
      width: 10px;
      height: 10px;
      border-bottom: 1px solid #c0c4cc;
      border-right: 1px solid #c0c4cc;
      position: absolute;
      bottom: 0;
      left: -4px;
      transform: rotate(45deg);
    }
  }
  .steps-delete {
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    color: #fff;
    background: #f56c6c;
    font-size: 16px;
    top: -8px;
    right: -8px;
    line-height: 12px;
    cursor: pointer;
    align-items: center;
    justify-content: center;
  }
  .steps-add {
    position: absolute;
    text-align: center;
    border-radius: 100%;
    width: 20px;
    height: 20px;
    line-height: 18px;
    bottom: -40px;
    background-color: #1b77ff;
    color: #fff;
    z-index: 1;
    cursor: pointer;
  }
  .steps-item {
    cursor: pointer;
    width: 100%;
    div {
      display: flex;
      span:nth-child(1) {
        flex-shrink: 0;
      }
      span:nth-child(2) {
        white-space: pre-wrap;
        word-break: break-all;
        // overflow: hidden;
      }
    }
  }
}

.steps-start,
.steps-end {
  border-radius: 50%;
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #1b77ff;
}
</style>
