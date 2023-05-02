<template>
  <div class="select-box" :class="[className]" @click="activeFn">
    <div class="label" :class="[className, active ? 'label-selected' : '']">
      {{ selectedValue }}
    </div>
    <div class="list" :class="[className]" v-show="active">
      <div class="tips">{{ tips }}</div>
      <div
        v-for="(item, index) in list"
        :key="index"
        class="select-part"
        :class="[className]"
        @click="chooseFn(item, index)"
      >
        <span> {{ item.sign ? `${item.sign} ${item.name}` : item.name }}</span>
        <img v-show="index === selectedIndex" src="@/assets/images/icon-check.png" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, defineProps, getCurrentInstance, defineEmits } from 'vue';

let _active_select_index = 0; // 全局计数器，所有组件都用。 点击+1， 最高的是当前组件。其他组件关闭弹窗
const active = ref(false); // 弹窗是否展示
const active_select_index = ref(0); // 当前组件计数器
const eventFn = (e) => {
  const { className } = e.target;
  //   console.log(className, active_select_index.value, _active_select_index);
  // 如果不是最高层级的组件 关闭弹窗
  if (active_select_index.value !== _active_select_index) {
    active.value = false;
    document.removeEventListener('click', eventFn);
  }
  // 如果有_r_select_my_use类名 点击的不是该组件 需要关闭弹窗
  if (className.indexOf(proxy.className) === -1) {
    active.value = false;
    document.removeEventListener('click', eventFn);
  }
};
const selectedIndex = ref(0); // 当前选中内容
const selectedValue = ref(''); // 当前选中内容

defineProps({
  className: {
    type: String,
    default: '_r_select_my_use',
  },
  tips: String, // 提示语
  value: String, // 默认内容
  list: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits(['chooseFn']);

const { proxy } = getCurrentInstance();

onMounted(() => {
  selectedValue.value = proxy.value;
  selectedIndex.value = proxy.list.findIndex((item) => item.name === proxy.value);
});

const activeFn = () => {
  document.addEventListener('click', eventFn);
  // 点击组件 弹窗显示隐藏
  active.value = !active.value;
  // 全局计数器+1
  _active_select_index += 1;
  // 当前组件计数器 赋值
  active_select_index.value = _active_select_index;
};
const chooseFn = (obj, index) => {
  selectedValue.value = obj.name;
  selectedIndex.value = index;
  emit('chooseFn', obj);
};
</script>

<style lang="less" scoped>
.select-box {
  position: relative;
  height: 38px;
  min-width: 64px;
  cursor: pointer;
  display: flex;
  align-items: center;

  .label {
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    //color: #e5fff8;
    line-height: 22px;
  }
  .label-selected {
    //color: #11d688;
  }

  .list {
    position: absolute;
    left: -50px;
    bottom: 0;
    padding: 16px 0px;
    width: 160px;
    background: #ffffff;
    border-radius: 10px;
    transform: translateY(100%);
    overflow-y: auto;
    z-index: 9;
    scrollbar-width: none;
    box-shadow: 0 0  1px 1px rgba(0, 0, 0, 0.1);

    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none;
    }
    .tips {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #5e7678;
      line-height: 17px;
      margin-left: 16px;
      margin-bottom: 5px;
    }
    .select-part {
      //   height: 34px;
      background: #ffffff;
      padding: 8px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      span {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        //color: rgba(#e5fff8, 0.8);
        line-height: 20px;
      }
      img {
        width: 9px;
        height: 7px;
      }
      &:hover {
        background: #eeeeee;
      }
    }
  }
}
</style>
