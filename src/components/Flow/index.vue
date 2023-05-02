<template>
  <div class="flow-main">
    <a-skeleton active :loading="loading">
      <div class="flow-approval" v-if="formState.showAction">
        <CommonSubTitle title="审批意见" />
        <div class="flow-approval-input">
          <a-textarea
            v-model:value="formState.remark"
            :rows="4"
            placeholder="请输入"
            :maxlength="300"
          />
        </div>
        <div class="flow-approval-bottom">
          <a-space>
            <a-button type="primary" :loading="requestLoading" @click.stop="onFinish(true)"
              >通 过</a-button
            >
            <a-button style="color: #f22933" :loading="requestLoading" @click.stop="onFinish(false)"
              >拒 绝</a-button
            >
          </a-space>
        </div>
      </div>

      <div class="flow-list">
        <CommonSubTitle title="审批流程" />
        <div class="flow-content">
          <a-steps progress-dot :current="formState.current" direction="vertical">
            <a-step v-for="(item, index) in formState.flowDetail.taskList" :key="index">
              <template #title>
                <div class="list-title">
                  <span>{{ item.name }}</span>
                  <span
                    v-if="item.type !== 1 && index <= formState.current"
                    :class="[item.statusConfig.color]"
                    >{{ item.statusConfig.text }}</span
                  >
                </div>
              </template>
              <template #description>
                <div class="list-content" v-if="item.type === 1">
                  <span class="list-content-name">{{ item.creator.assignee }}</span>
                  <span class="list-content-time">{{ item.creator.createTime }}</span>
                </div>
                <div class="list-content" v-else>
                  <div
                    class="list-content-approval"
                    :class="[el.padding ? '' : 'list-content-approval-1']"
                    v-for="(el, number) in item.config.list"
                    :key="number"
                  >
                    <div class="list-content-approval-top">
                      <span>{{ el.name }}</span>
                      <span :class="[el.color]">{{ el.text }}</span>
                    </div>
                    <div class="list-content-approval-tips">{{ el.remark }}</div>
                    <div class="list-content-approval-tips">{{ el.time }}</div>
                  </div>
                  <div v-if="item.config.unfinished" class="list-content-unfinish">
                    <span>{{ item.type === 2 ? '会签' : '或签' }}待审核：</span>
                    <span>{{ item.config.unfinished }}</span>
                  </div>
                </div>
                <!-- <div class="list-content" v-else-if="item.type === 3">
                  <span class="list-content-name">{{ item.config.name }}</span>
                  <span class="list-content-time">{{ item.config.remark }}</span>
                  <span class="list-content-time">{{ item.time }}</span>
                </div> -->
              </template>
            </a-step>
          </a-steps>
        </div>
      </div>
    </a-skeleton>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, getCurrentInstance } from 'vue';
import CommonSubTitle from '@/components/CommonSubTitle/index.vue';
import { flowDetailByBusinessKey } from '@/api/flow';
import store from '@/store';

const props = defineProps({
  businessKey: {
    type: String,
    required: true,
  },
  params: {
    type: Object,
    default: () => {},
  },
  api: {
    type: Function,
    required: true,
  },
  name: {
    // 具体业务调用名称, 用于弹窗提示
    type: String,
    default: '',
  },
});

const formState = reactive({
  // 当前节点
  current: 0,
  // 审批意见
  remark: '',
  // 流程实例任务id(当前操作人对应的任务实例id)
  processInstanceTaskId: '',
  // 详情
  flowDetail: {
    taskList: [],
  },

  // 当前审批流是否进行中且查看者是当前节点的审批人，才显示审批内容输入框
  showAction: false,
});

// 获取当前审批流信息
const loading = ref(false);
onMounted(() => {
  getFlow(props.businessKey);
});
const getFlow = (businessKey) => {
  if (!businessKey) return;
  loading.value = true;
  formState.current = 0;
  formState.showAction = false;
  flowDetailByBusinessKey(businessKey)
    .then((res) => {
      res.taskList.forEach((item, index) => {
        if (item.type === 1) {
          // 发起人
          item.creator = item.instanceTaskList[0] ?? {};
        } else if (item.type === 2) {
          item.config = getFlowType2Task(item);
        } else if (item.type === 3) {
          item.config = getFlowType3Task(item);
        }
        item.statusConfig = setStatusConfig(item);
        if (item.status !== 0 && res.taskList.length === index + 1) {
          // 最后节点是否已完成
          formState.showAction = false;
          formState.current = index;
        } else if (
          res.currentAssignee === item.assignee &&
          formState.current === 0 &&
          item.status !== 1
        ) {
          // 当前未操作节点
          formState.current = index;
          // 当前节点进行中且当前用户为未操作的审批人
          if (item.status === 0) {
            const currentUserId = store.getters.userId;
            console.log('flow-', currentUserId);
            const instance = item.instanceTaskList.find(
              (el) => el.assigneeId === currentUserId && el.status === 0,
            );
            if (instance) {
              formState.showAction = true;
              formState.processInstanceTaskId = instance.id;
              console.log('flow-', instance);
            } else {
              formState.showAction = false;
            }
          } else {
            formState.showAction = false;
          }
        }
      });
      formState.flowDetail = res;
    })
    .finally(() => {
      loading.value = false;
    });
};

const getFlowType2Task = (task) => {
  // 会签任务(只要一个拒绝或者全部通过才完成)
  // 判断该节点是否完成(状态 0-进行中 1-已通过 2-已驳回)
  // 获取该节点下已通过的审批人
  const agrees = task.instanceTaskList
    .filter((item) => item.status === 1)
    .map((instance) => ({
      name: instance.assignee,
      time: instance.updateTime ?? instance.createTime,
      remark: instance.remark,
      status: instance.status,
      ...setStatusConfig(instance),
    }));
  // 未审批的
  let unfinished = '';
  // 如果该节点已拒绝
  if (task.status === 2) {
    const instance = task.instanceTaskList.find((item) => item.status === task.status);
    instance &&
      agrees.push({
        name: instance.assignee,
        time: instance.updateTime ?? instance.createTime,
        remark: instance.remark,
        status: instance.status,
        ...setStatusConfig(instance),
      });
  } else if (task.status === 0) {
    unfinished = task.instanceTaskList
      .filter((item) => item.status === 0)
      .map((item) => item.assignee)
      .join('/');
  }
  if (!unfinished && agrees.length === 1) {
    // 无待审核，且审批记录只有一条不需要内嵌
    agrees.forEach((item) => {
      item.padding = true;
    });
  }
  return { list: agrees, status: task.status, unfinished };
};

const getFlowType3Task = (task) => {
  // 或签任务(只要一个人通过或者拒绝就完成)
  // 判断该节点是否完成(状态 0-进行中 1-已通过 2-已驳回)\
  // 获取已拒绝的审批人列表
  const list = task.instanceTaskList
    .filter((item) => item.status === 2)
    .map((instance) => ({
      name: instance.assignee,
      time: instance.updateTime ?? instance.createTime,
      remark: instance.remark,
      status: instance.status,
      ...setStatusConfig(instance),
    }));
  // 未审批的
  let unfinished = '';
  if (task.status === 0) {
    // 待审核的人员
    unfinished = task.instanceTaskList
      .filter((item) => item.status === 0)
      .map((item) => item.assignee)
      .join('、');
  } else if (task.status === 1) {
    const instance = task.instanceTaskList.find((item) => item.status === task.status);
    instance &&
      list.push({
        name: instance.assignee,
        time: instance.updateTime ?? instance.createTime,
        remark: instance.remark,
        status: instance.status,
        ...setStatusConfig(instance),
      });
  }
  if (!unfinished && list.length === 1) {
    // 无待审核，且审批记录只有一条不需要内嵌
    list.forEach((item) => {
      item.padding = true;
    });
  }
  console.log(list);
  return { list, status: task.status, unfinished };
};

const setStatusConfig = (item) => {
  const names = ['待审批', '已通过', '已拒绝'];
  const colors = ['status-0', 'status-1', 'status-2'];
  return { text: names[item.status], color: colors[item.status] };
};

// 审批
const requestLoading = ref(false);
const { proxy } = getCurrentInstance();
const emits = defineEmits(['finish']);

const onFinish = (bool) => {
  const content = `请确认是否${bool ? '通过' : '拒绝'}${props.name}`;
  proxy.$confirm({
    content,
    onOk() {
      return new Promise((resolve, reject) => {
        requestLoading.value = true;
        const params = Object.assign(
          {
            processInstanceTaskId: formState.processInstanceTaskId,
            approve: bool,
            remark: formState.remark,
          },
          props.params,
        );
        props
          .api(params)
          .then(() => {
            resolve();
            proxy.$message.success('完成审批');
            getFlow(props.businessKey);
            formState.remark = '';
            emits('finish', {});
          })
          .catch(() => reject())
          .finally(() => {
            requestLoading.value = false;
          });
      });
    },
  });
};
</script>

<style lang="less" scoped>
.flow-main {
  background-color: #f4f4f4;
  padding-left: 16px;
  flex: 1;
  .flow-approval {
    background: #ffffff;
    border-radius: 2px;
    width: 320px;
    margin-bottom: 20px;
    &-input {
      margin: 0 20px;
    }
    &-bottom {
      display: flex;
      justify-content: flex-end;
      padding: 16px 20px 20px;
    }
  }
  .flow-list {
    background: #ffffff;
    border-radius: 2px;
    width: 320px;
    .flow-content {
      padding: 0px 0px 20px 25px;
    }
    .list-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      span:nth-child(1) {
        font-weight: 500;
        font-size: 14px;
        color: #000000d9;
        line-height: 22px;
      }
      span:nth-child(2) {
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
      }
    }
    .list-content {
      display: flex;
      flex-direction: column;
      &-name {
        font-weight: 500;
        font-size: 14px;
        color: #000000d9;
        line-height: 22px;
      }
      &-time {
        font-weight: 400;
        font-size: 12px;
        color: #00000073;
        line-height: 20px;
      }

      &-unfinish {
        display: flex;
        padding-right: 10px;
        word-break: break-all;
        span:nth-child(1) {
          font-weight: 400;
          font-size: 12px;
          color: #00000073;
          line-height: 20px;
          flex-shrink: 0;
        }
        span:nth-child(2) {
          margin-left: 6px;
          font-weight: 400;
          font-size: 12px;
          color: #00000073;
          line-height: 20px;
        }
      }
      &-approval {
        margin: 2px 16px 2px 5px;
        &-top {
          display: flex;
          justify-content: space-between;
          span:nth-child(1) {
            font-weight: 500;
            font-size: 12px;
            color: #000000d9;
            line-height: 18px;
          }
          span:nth-child(2) {
            font-weight: 500;
            font-size: 12px;
            line-height: 18px;
          }
        }
        &-tips {
          font-weight: 400;
          font-size: 12px;
          color: #00000073;
          line-height: 18px;
        }
      }
      &-approval-1 {
        padding: 5px;
        background-color: #f5f6f5;
      }
    }
  }
}

.status-0 {
  color: #1b77ff;
}
.status-1 {
  color: #52c41a;
}
.status-2 {
  color: #f22933;
}
:deep(.ant-steps-item-title) {
  width: 100% !important;
}
</style>
