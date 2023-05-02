<template>
  <a-card :bordered="false" :bodyStyle="{ padding: '16px' }">
    <!-- <a-card-meta>
      <img :src="imgTool.getAssetsFile(`${titleImgUrl}@2x.png`)" width="40" />
    </a-card-meta> -->
    <div slot="title" class="h50">
      <img :src="imgTool.getAssetsFile(`HomePage/${titleImgUrl}@2x.png`)" width="24" />
      <span class="f-5w f-16 c-0085 ml-8">{{ shqTitle }}</span>
      <a class="f-14 fr" @click.stop="$router.push({ path: moreUrl })">查看更多</a>
    </div>
    <!-- <template #extra><a :href="moreUrl">查看更多</a></template> -->
    <a-table :columns="shqColumns" :dataSource="shqDataSource" bordered :pagination="false">
      <template #bodyCell="{ column, record, index, text }">
        <template v-if="column.key === 'computedText'">
          <span>{{ statusArr[Number(text)] }}</span>
        </template>
        <template v-if="column.key === 'type'">
          <span>{{ typeArr[Number(text)] }}</span>
        </template>
        <template v-else-if="column.key === 'sex'">
          <span>{{ sexText(text) }}</span>
        </template>
        <template v-else-if="column.key === 'date'">
          <span>{{ dayjs(text).format('YYYY-MM-DD') }}</span>
        </template>
        <template v-else-if="column.key === 'money'">
          <span>{{ totalAmount(text) }}</span>
        </template>
        <template v-else-if="column.key === 'extra'">
          <slot name="onemore" :text="text"></slot>
        </template>
      </template>
    </a-table>
  </a-card>
</template>

<script setup>
import dayjs from 'dayjs';
import { defineProps, computed } from 'vue';
import imgTool from '@/utils/imgTool';

const props = defineProps({
  shqTitle: {
    // form查询项
    type: String,
    default: '默认标题',
  },
  shqColumns: {
    // form查询数据
    type: Array,
    default: [],
  },
  shqDataSource: {
    type: Array,
    default: [],
  },
  moreUrl: {
    type: String,
    default: '#',
  },
  statusArr: {
    type: Array,
    default: [],
  },
  typeArr: {
    type: Array,
    default: [],
  },
  titleImgUrl: {
    type: String,
    default: '',
  },
});
// 性别
const sexText = computed(() => {
  return (value) => {
    // 0-未知 1-女 2-男
    if (value === null) return '未知';
    return ['未知', '女', '男'][value];
  };
});

// 金额
const totalAmount = computed(() => {
  return (values) => {
    return values ? `￥${Number(values).toFixed(2)}` : '￥0';
  };
});
</script>

<style lang="less"></style>
