<template>
  <PageContainer>
    <div class="index-container">
      <div class="left-container">
        <a-skeleton active :loading="dataScouce.loading">
          <div class="top-box">
            <div class="top-1-box">
              <span class="top-1-box-tips">所有分类：</span>
              <div class="top-1-box-list">
                <span
                  v-for="(item, index) in dataScouce.list_1"
                  :key="index"
                  class="item1-box"
                  :class="[index === dataScouce.current_1 ? 'item1-box-selected' : '']"
                  @click.stop="changeFirst(index)"
                  >{{ item.name }}</span
                >
              </div>
            </div>
            <div class="top-2-box">
              <div
                v-for="(item, index) in dataScouce.list_2"
                :key="index"
                class="item2-box"
                :class="[index === dataScouce.current_2 ? 'item2-box-selected' : '']"
                @click.stop="changeSecond(index)"
              >
                {{ item.name }}
              </div>
            </div>
            <!-- <div class="top-3-box">
            <a-checkbox
              v-model:checked="dataScouce.checkAll"
              :indeterminate="dataScouce.indeterminate"
              @change="onCheckAllChange"
              style="flex-shrink: 1; margin-right: 24px"
            >
              全部
            </a-checkbox>
            <a-checkbox-group
              v-model:value="dataScouce.checkedList"
              :options="dataScouce.plainOptions"
              style="flex: 1"
              class="checkbox-all"
              :style="{ height: dataScouce.isShowMore ? 'auto' : '20px' }"
            />
            <div class="more-box" @click.stop="dataScouce.isShowMore = !dataScouce.isShowMore">
              <span>{{ dataScouce.isShowMore ? '收起' : '更多' }}</span>
              <up-outlined v-if="dataScouce.isShowMore" />
              <down-outlined v-else />
            </div>
          </div> -->
          </div>
          <a-empty v-if="dataScouce.list_3.length === 0" class="list-empty"></a-empty>
          <div class="content-box" v-else>
            <div
              class="item3-box"
              v-for="(item, index) in dataScouce.list_3"
              :key="index"
              @click.stop="showDetail(item)"
            >
              <div class="item3-box-image">
                <img :src="item.imgUrl" />
              </div>
              <div class="item3-box-bottom">
                <span>{{ item.name }}</span>
                <div>加入采购</div>
              </div>
            </div>
          </div>
        </a-skeleton>
      </div>
      <div class="right-container">
        <div class="right-container-title">采购预算清单</div>
        <a-empty v-if="dataScouce.resultList.length === 0" style="margin-top: 16px"></a-empty>
        <div v-else class="result-box">
          <div class="result-item-box" v-for="(item, index) in dataScouce.resultList" :key="index">
            <div class="result-item-box-top">
              <img :src="item.imgUrl" />
              <div class="result-item-box-top-right">
                <div class="result-item-box-top-right-title">{{ item.categoryName }}</div>
                <div class="result-item-box-top-right-skus">
                  <div class="result-item-box-top-right-skus-tips">规格：</div>
                  <div class="result-item-box-top-right-skus-box">
                    {{ item.categorySpecs }}
                    <!-- <span class="" v-for="(sku, j) in item.skus" :key="j"></span> -->
                  </div>
                </div>
              </div>
            </div>
            <div class="result-item-box-bottom">
              <div>
                采购金额：<span style="color: rgba(0, 0, 0)">{{ item.price || '-' }}万元</span>
              </div>
              <div>
                采购频次：<span style="color: rgba(0, 0, 0, 0.65)">{{
                  `${item.purchaseCycleValue || '-'}次/` +
                  ['', '日', '周', '月', '季度', '年'][item.purchaseCycle]
                }}</span>
              </div>
              <div>
                期望到货时间：<span style="color: rgba(0, 0, 0, 0.65)">{{
                  item.expectedArrivalTime || '-'
                }}</span>
              </div>
              <div>
                采购备注：<span style="color: rgba(0, 0, 0, 0.65)">{{ item.remark || '-' }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="right-container-bottom" v-if="dataScouce.resultList.length !== 0">
          <a-button class="right-container-bottom-button" @click.stop="handleDone"
            >确认提交</a-button
          >
        </div>
      </div>

      <GoodsModal ref="goodsModal" @finish="submitAdd" />
    </div>
  </PageContainer>
</template>

<script setup>
import { getCurrentInstance, onMounted, reactive, watch } from 'vue';
import { UpOutlined, DownOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import GoodsModal from './components/GoodsModal.vue';
import { categoryAll } from '@/api/common';

const router = useRouter();
const { proxy } = getCurrentInstance();

onMounted(() => {
  getCategoryList();
});

const getCategoryList = () => {
  dataScouce.loading = true;
  categoryAll()
    .then((res) => {
      dataScouce.list_1 = res;
      changeFirst(0);
    })
    .finally(() => {
      dataScouce.loading = false;
    });
};

const dataScouce = reactive({
  loading: false,
  // left
  current_1: 0,
  list_1: [],
  current_2: 0,
  list_2: [],
  list_3: [],

  // 更多分类内容
  isShowMore: false,
  indeterminate: true,
  checkAll: false,
  checkedList: [],
  plainOptions: [],

  // right
  resultList: [],
});

// checkbox
const onCheckAllChange = (e) => {
  console.log(e);
  dataScouce.checkedList = e.target.checked
    ? dataScouce.plainOptions.map((item) => item.value)
    : [];
  dataScouce.indeterminate = false;
};

watch(
  () => dataScouce.checkedList,
  (val) => {
    dataScouce.indeterminate = !!val.length && val.length < dataScouce.plainOptions.length;
    dataScouce.checkAll = val.length === dataScouce.plainOptions.length;
  },
);

const changeFirst = (index) => {
  dataScouce.current_1 = index;
  dataScouce.current_2 = 0;
  dataScouce.list_2 = dataScouce.list_1[index].children;
  dataScouce.list_3 =
    dataScouce.list_2 && dataScouce.list_2.length > 0 ? dataScouce.list_2[0].children : [];
};

const changeSecond = (index) => {
  dataScouce.current_2 = index;
  dataScouce.list_3 = dataScouce.list_2[index].children;
};

const showDetail = (item) => {
  proxy.$refs.goodsModal.show({
    ...item,
    specList: dataScouce.list_2[dataScouce.current_2].specList,
  });
};

const submitAdd = (values) => {
  dataScouce.resultList.push(values);
};

const handleDone = () => {
  console.log(dataScouce.resultList);
  router.push({
    path: '/purchasingManagement/demand-add',
    query: { info: JSON.stringify(dataScouce.resultList) },
  });
};
</script>

<style lang="less" scoped>
::v-deep(.ant-checkbox-group-item) {
  margin-right: 30px;
  margin-bottom: 10px;
  color: rgba(0, 0, 0, 0.65);
}
.index-container {
  width: 100%;
  flex: 1;
  //   margin: 20px;
  background: #f5f5f5;
  display: flex;

  .left-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    // margin-left: 100px;
    overflow: hidden;
    .top-box {
      overflow: hidden;
      border: 0.5px solid #e6e6e6;
      .top-1-box {
        width: 100%;
        background: #ffffff;
        display: flex;
        align-items: center;
        height: 55px;
        padding: 0 16px;
        font-weight: 400;
        font-size: 14px;
        letter-spacing: 0;
        line-height: 22px;
        &-tips {
          color: rgba(0, 0, 0, 0.45);
          margin-right: 14px;
          flex-shrink: 1;
        }
        &-list {
          display: flex;
          flex: 1;
          gap: 40px;
          overflow-x: auto;
          .item1-box {
            color: rgba(0, 0, 0, 0.85);
            transition: all 0.5s;
            cursor: pointer;
            white-space: nowrap;
            &:hover {
              color: #1b77ff;
            }
          }
          .item1-box-selected {
            color: #1b77ff;
          }
        }
      }
      .top-2-box {
        background: rgba(0, 0, 0, 0.02);
        box-shadow: 0 -1px 0 0 rgba(0, 0, 0, 0.05);
        overflow-x: auto;
        height: 55px;
        padding: 0 24px;
        display: flex;
        gap: 40px;
        align-items: center;
        font-weight: 400;
        font-size: 14px;
        letter-spacing: 0;
        line-height: 22px;
        .item2-box {
          color: rgba(0, 0, 0, 0.85);
          transition: all 0.5s;
          cursor: pointer;
          white-space: nowrap;
          &:hover {
            color: #1b77ff;
          }
        }
        .item2-box-selected {
          color: #1b77ff;
        }
      }
      .top-3-box {
        display: flex;
        // align-items: center;
        background: #ffffff;
        border: 0.5px solid #e6e6e6;
        margin-top: 8px;
        padding: 19px 16px;
        min-height: 54px;
        .checkbox-all {
          height: 20px;
          overflow: hidden;
        }
        .more-box {
          cursor: pointer;
          font-weight: 400;
          font-size: 14px;
          color: rgba(0, 0, 0, 0.65);
          &:hover {
            color: #1b77ff;
          }
          span:nth-child(1) {
            margin-right: 4px;
          }
        }
      }
    }
    .content-box {
      margin-top: 16px;
      background: #f5f5f5;
      display: grid;
      grid-template-columns: repeat(4, minmax(0px, 1fr));
      gap: 8px;
      .item3-box {
        background: #ffffff;
        display: flex;
        flex-direction: column;
        border: 1px solid #e6e6e6;
        height: 266px;
        cursor: pointer;
        overflow: hidden;
        // width: 218px;
        .item3-box-image {
          overflow: hidden;
          flex: 1;
          img {
            width: 100%;
            object-fit: cover;
            overflow: hidden;
            transition: transform 0.5s;
            -webkit-transition: transform 0.5s;
            -moz-transition: transform 0.5s;
          }
        }

        .item3-box-bottom {
          display: flex;
          align-items: center;
          font-size: 14px;
          padding: 0 12px;
          height: 48px;
          flex-shrink: 1;
          // border-top: 1px solid rgba(0, 0, 0, 0.06);
          span {
            font-weight: 500;
            color: rgba(0, 0, 0, 0.85);
            flex: 1;
            margin-right: 10px;
          }
          div {
            flex-shrink: 1;
            width: 72px;
            height: 24px;
            border: 1px solid #1b77ff;
            border-radius: 2px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 400;
            color: #1b77ff;
            cursor: pointer;
            &:hover {
              background: #1b77ff;
              color: #fff;
            }
          }
        }
        &:hover {
          border: 1px solid #1b77ff;
          .item3-box-image {
            img {
              transform: scale(1.05);
              -webkit-transform: scale(1.05);
              -moz-transform: scale(1.05);
            }
          }
        }
      }
    }
    .list-empty {
      flex: 1;
      justify-content: center;
      display: flex;
      flex-direction: column;
      padding-top: 20px;
    }
  }

  .right-container {
    width: 288px;
    margin-left: 16px;
    // margin-right: 100px;
    flex-shrink: 1;
    // background: #fff;
    &-title {
      font-weight: 500;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.85);
      letter-spacing: 0;
      height: 53px;
      border-bottom: 0.5px solid rgba(0, 0, 0, 0.15);
      padding: 15px 12px;
      background: #fff;
    }
    .result-box {
      display: flex;
      flex-direction: column;
      padding: 0 12px;
      background: #fff;
      .result-item-box {
        padding: 12px 0;
        &-top {
          display: flex;
          img {
            width: 60px;
            height: 60px;
            object-fit: cover;
            flex-shrink: 1;
            margin-right: 8px;
          }
          &-right {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            &-title {
              font-weight: 500;
              font-size: 14px;
              color: rgba(0, 0, 0, 0.85);
              line-height: 18px;
            }
            &-skus {
              font-size: 12px;
              line-height: 16px;
              font-weight: 400;
              margin-top: 8px;
              display: flex;
              &-tips {
                color: rgba(0, 0, 0, 0.65);
                margin-right: 2px;
                flex-shrink: 1;
              }
              &-box {
                flex: 1;
                display: flex;
                flex-wrap: wrap;
                color: rgba(0, 0, 0, 0.45);
              }
            }
          }
        }
        &-bottom {
          margin-top: 8px;
          width: 100%;
          background: #f7f7f7;
          border-radius: 2px;
          padding: 6px 8px;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          div {
            width: 48%;
            font-size: 12px;
            line-height: 18px;
            color: rgba(0, 0, 0, 0.45);
            span {
              white-space: pre-wrap;
              word-break: break-all;
            }
          }
          div:nth-child(3) {
            width: 100%;
          }
          div:nth-child(4) {
            width: 100%;
          }
        }
        &:nth-child(n + 2) {
          border-top: 0.5px dashed rgba(0, 0, 0, 0.15);
        }
      }
    }
    &-bottom {
      display: flex;
      justify-content: flex-end;
      border-top: 0.5px solid rgba(0, 0, 0, 0.15);
      height: 60px;
      align-items: center;
      background: #fff;
      &-button {
        cursor: pointer;
        width: 91px;
        height: 36px;
        background: #1b77ff;
        border-radius: 2px;
        font-weight: 400;
        font-size: 16px;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 12px;
      }
    }
  }
}
</style>
