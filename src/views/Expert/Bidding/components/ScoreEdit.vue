<template>
  <div class="full-box">
    <div class="container-box">
      <div class="flex full-header">
        <div class="w6-w">评分模版</div>
        <div class="flex-1">供应商评分</div>
      </div>

      <div class="flex table-th">
        <div class="w6-w table-header flex">
          <span>类型</span>
          <span>指标组</span>
          <span>指标</span>
          <span>评分标准</span>
          <span>最高分值</span>
        </div>
        <div class="supplier-header">
          <span v-for="(item, index) in scoreList" :key="index" class="w2-w">{{ item.name }}</span>
        </div>
      </div>

      <div class="">
        <div v-for="(group, index) in templates" :key="index" class="">
          <div class="flex group-box">
            <span class="template-key">{{ group.key }}</span>
            <div class="">
              <div v-for="temp in group.values" :key="temp.id" class="template-values">
                <div class="w09-w template-name">{{ temp.indexGroupName }}</div>
                <div class="w09-w template-name">{{ temp.indexName }}</div>
                <div class="w2-4w template-name">{{ temp.scoreCriteria }}</div>
                <div class="w09-w template-name">{{ temp.maxScore }}</div>
                <div v-for="item in scoreList" :key="item.id" class="w2-w template-input">
                  <a-input-number
                    :max="temp.maxScore"
                    placeholder="请输入分值"
                    v-model:value="item[group.type][temp.id]"
                    style="width: 90%"
                    :disabled="canDisable"
                  ></a-input-number>
                </div>
              </div>
            </div>
          </div>
          <div class="flex score-total">
            <div>{{ group.key }}小计</div>
            <div class="w09-w">{{ getGroupKeyScore(group) }}</div>
            <div class="flex">
              <span v-for="(item, index) in scoreList" :key="index" class="w2-w">{{
                getGroupSupplierScore(item[group.type])
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex remark-box">
        <div class="w6-w">评分意见</div>
        <div class="w2-w supplier-box" v-for="(item, index) in scoreList" :key="index">
          <a-input
            :placeholder="canDisable ? '-' : '请输入'"
            v-model:value="item.remark"
            style="width: 90%"
            :disabled="canDisable"
          ></a-input>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, getCurrentInstance, ref } from 'vue';

const { proxy } = getCurrentInstance();

const props = defineProps({
  templates: {
    type: Array,
    default: () => [], // [{key: '', value: []}]
  },
  data: {
    type: Array,
    default: () => [], // [{name, id, bidScoreTemplateItemId: value}]
  },
  canDisable: {
    type: Boolean,
    default: false,
  },
});

const scoreList = ref(props.data);

// 默认的小计
const getGroupKeyScore = (item) => {
  const score = item.values.reduce((pre, current) => {
    return pre + current.maxScore;
  }, 0);
  return score;
};

// 单供应商的小计
const getGroupSupplierScore = computed(() => {
  return (value) => {
    let score = 0;
    Object.keys(value).forEach((key) => {
      score += Number(value[key]);
    });
    return score;
  };
});

const validate = () => {
  return new Promise((resolve, reject) => {
    const result = [];
    for (let i = 0; i < scoreList.value.length; i++) {
      const element = scoreList.value[i];
      const temp = { bidSupplierId: element.id, businessScoreItemList: [], techScoreItemList: [] };
      const { remark, techScoreItemList, businessScoreItemList } = element;
      if (!remark) {
        console.log(element);
        proxy.$message.warning('请完善评标信息');
        reject();
        return;
      } else {
        temp.remark = remark;
      }

      const keys1 = Object.keys(techScoreItemList);
      for (let index = 0; index < keys1.length; index++) {
        const el = keys1[index];
        const isEmpty = techScoreItemList[el] == null || techScoreItemList[el] === '';
        if (isEmpty) {
          console.log(el, techScoreItemList, element);
          proxy.$message.warning('请完善评标信息');
          reject();
          return;
        } else {
          temp.techScoreItemList.push({ bidScoreTemplateItemId: el, score: techScoreItemList[el] });
        }
      }

      const keys2 = Object.keys(businessScoreItemList);
      for (let index = 0; index < keys2.length; index++) {
        const el = keys2[index];
        const isEmpty = businessScoreItemList[el] == null || businessScoreItemList[el] === '';
        if (isEmpty) {
          console.log(el, businessScoreItemList, element);
          proxy.$message.warning('请完善评标信息');
          reject();
          return;
        } else {
          temp.businessScoreItemList.push({
            bidScoreTemplateItemId: el,
            score: businessScoreItemList[el],
          });
        }
      }

      result.push(temp);
    }
    resolve(result);
  });
};

defineExpose({
  validate,
});
</script>
supplier-header

<style lang="less" scoped>
.full-box {
  margin: 0 33px 20px;
  border: 1px solid #f0f0f0;
  border-radius: 2px;
  overflow-x: auto;
  .container-box {
    display: inline-block;
    border-right: 1px solid #f0f0f0;
  }

  .w6-w {
    width: 600px;
    text-align: center;
  }
  .w09-w {
    width: 90px;
    text-align: center;
  }
  .w2-w {
    width: 200px;
    text-align: center;
  }
  .w2-4w {
    width: 240px;
    text-align: center;
  }

  .full-header {
    background-color: #fafafa;

    border-bottom: 1px solid #f0f0f0;
    div {
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      padding: 16px;
    }
    div:nth-child(1) {
      border-right: 1px solid #f0f0f0;
    }
  }

  .table-th {
    background-color: #fafafa;

    border-bottom: 1px solid #f0f0f0;
    .table-header {
      flex-shrink: 0;

      span {
        width: 15%;
        text-align: center;
        border-right: 1px solid #f0f0f0;
        padding: 16px 0;
      }
      span:nth-child(4) {
        width: 40%;
      }
    }
    .supplier-header {
      display: flex;
      span {
        padding: 16px;
      }

      span:not(:last-child) {
        border-right: 1px solid #f0f0f0;
      }
    }
  }

  .group-box {
    .template-key {
      width: 90px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      border-bottom: 1px solid #f0f0f0;
      border-right: 1px solid #f0f0f0;
    }
    .template-values {
      display: flex;
      border-bottom: 1px solid #f0f0f0;
      .template-name {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
        word-break: break-all;
        border-right: 1px solid #f0f0f0;
      }
      .template-input {
        display: flex;
        align-items: center;
        justify-content: center;
        &:not(:last-child) {
          border-right: 1px solid #f0f0f0;
        }
      }
    }
  }
  .score-total {
    div:nth-child(1) {
      background-color: #fafafa;
      flex-shrink: 0;
      width: 510px;
      text-align: center;
      padding: 16px;
      border-bottom: 1px solid #f0f0f0;
      border-right: 1px solid #f0f0f0;
    }

    div:nth-child(2) {
      padding: 16px;
      border-bottom: 1px solid #f0f0f0;
      border-right: 1px solid #f0f0f0;
      flex-shrink: 0;
    }
    div:nth-child(3) {
      span {
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid #f0f0f0;
        // padding: 16px;
      }
      span:not(:last-child) {
        border-right: 1px solid #f0f0f0;
      }
    }
  }

  .remark-box {
    align-items: center;
    div:nth-child(1) {
      background-color: #fafafa;
      padding: 16px;
      flex-shrink: 0;
      border-right: 1px solid #f0f0f0;
    }
    .supplier-box {
      &:not(:last-child) {
        border-right: 1px solid #f0f0f0;
      }
    }
  }
}
.flex {
  display: flex;
}
.flex-1 {
  flex: 1;
}
</style>
