<template>
  <div class="page">
    <topHeaderVue></topHeaderVue>
    <topNavVue></topNavVue>
    <div class="content">
      <div class="head">
        <div class="header-content">
          <div id="searchCategory">
            <div class="header-content-item">
              <div class="title">所有分类：</div>
              <div class="bars">
                <a
                  class="bar"
                  v-for="(item, index) in categoryData"
                  :class="{ active: item.id == searchOptions.category1Id }"
                  :key="item.id"
                  @click="handleClickCategory1(item, index)"
                >
                  {{ item.name }}
                  <div v-if="item.id == searchOptions.category1Id" class="triangle"></div>
                </a>
              </div>
            </div>
          </div>

          <div v-if="category2Data && category2Data.length > 0" class="header-content-item">
            <!-- <div class="title">所有分类：</div> -->
            <div class="bars">
              <a
                class="bar"
                v-for="(item, index) in category2Data"
                :class="{ active: item.id == searchOptions.category2Id }"
                :key="item.id"
                @click="handleClickCategory2(item, index)"
                >{{ item.name }}</a
              >
            </div>
          </div>

          <div v-if="category3Data && category3Data.length > 0" class="header-content-item">
            <div class="title">
              <a-checkbox
                v-model:checked="state.checkAll"
                :indeterminate="state.indeterminate"
                @change="onCheckAllChange"
              >
                全选
              </a-checkbox>
            </div>
            <div class="bars">
              <a-checkbox-group v-model:value="state.checkedList" :options="category3Data" />
            </div>
          </div>

          <div class="header-content-item">
            <div class="title">商品品牌：</div>
            <div class="bars" style="gap: 8px">
              <img
                v-for="item in band"
                :src="item.url"
                alt=""
                style="width: 146px; height: 56px"
                :key="item"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="body">
        <div class="goods-bar" v-for="item in list" :key="item.id">
          <img
            :src="item.mainUrl || 'https://picsum.photos/200/300?id=022'"
            alt=""
            style="width: 116px; height: 116px; margin-top: 40px"
          />
          <div class="article">{{ item.name }}</div>
          <div class="price">￥{{ item.skus[0].taxPrice }}</div>
          <!-- <div class="market-price">市场价：¥6078.00</div> -->
        </div>
      </div>
    </div>
    <bottomVue></bottomVue>
  </div>
  <!-- 无限循环组件 -->
  <!-- <categoryMenuVue :list="categoryData"></categoryMenuVue> -->
</template>

<script setup>
import { ref, reactive, watch, computed, provide, onMounted } from 'vue';
import { useStore } from 'vuex';
import topHeaderVue from '../home/topHeader/index.vue';
import topNavVue from '../home/topNav/index.vue';
import bottomVue from '../home/bottom/index.vue';

import { productList } from '@/api/common';
import { productsByCategory } from '@/api/goods';

const band = ref([
  { url: new URL('@/assets/images/Home/brand_1@2x.png', import.meta.url).href },
  { url: new URL('@/assets/images/Home/brand_2@2x.png', import.meta.url).href },
  { url: new URL('@/assets/images/Home/brand_3@2x.png', import.meta.url).href },
  { url: new URL('@/assets/images/Home/brand_4@2x.png', import.meta.url).href },
  { url: new URL('@/assets/images/Home/brand_5@2x.png', import.meta.url).href },
  { url: new URL('@/assets/images/Home/brand_6@2x.png', import.meta.url).href },
  { url: new URL('@/assets/images/Home/brand_7@2x.png', import.meta.url).href },
  { url: new URL('@/assets/images/Home/brand_8@2x.png', import.meta.url).href },
]);

// -----------------------------------------
// ----------- 无限循环类目配置 -------------
// const categoryMenuIds = ref([]);
// const categoryMenuIdChange = (lev, id) => {
//   categoryMenuIds.value.splice(lev, categoryMenuIds.value.length - 1, id);
//   console.log(lev, id, categoryMenuIds.value);
// };
// provide('categoryMenu', { categoryMenuIdChange, categoryMenuIds });
//-----------------------------------------

const state = reactive({
  indeterminate: true,
  checkAll: false,
  checkedList: [],
});

const store = useStore();

const list = ref([]);
const categoryData = computed(() => store.getters.category);

const category2Data = computed(() => {
  if (!searchOptions.category1Id) return [];
  const category1Index = categoryData.value.findIndex(
    (item) => item.id === searchOptions.category1Id,
  );
  if (category1Index === -1) return [];
  return categoryData.value[category1Index].children;
});

const category3Data = computed(() => {
  if (!searchOptions.category2Id) return [];
  const category2Index = category2Data.value.findIndex(
    (item) => item.id === searchOptions.category2Id,
  );
  if (category2Index === -1) return [];
  const data = category2Data.value[category2Index].children.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });

  return data;
});

const searchOptions = reactive({
  category1Id: '',
  category2Id: '',
});

watch(
  () => store.getters.categoryIds,
  (val) => {
    getList(val);
  },
  { deep: true },
);

watch(
  () => state.checkedList,
  (val) => {
    state.indeterminate = !!val.length && val.length < category3Data.value.length;
    state.checkAll = val.length === category3Data.value.length;
    if (val.length > 0) {
      store.dispatch('setCategoryIds', val);
    }
  },
);

const getList = (categoryIds) => {
  const ids = categoryIds.join(',').toString();
  if (categoryIds.length > 1) {
    productsByCategory({
      idString: ids,
    }).then((res) => {
      list.value = res;
    });
  } else {
    productList(ids).then((res) => {
      list.value = res;
    });
  }
};

const onCheckAllChange = (e) => {
  const data = category3Data.value.map((item) => item.value);
  Object.assign(state, {
    checkedList: e.target.checked ? data : [],
    indeterminate: false,
  });
};

const handleClickCategory1 = (item) => {
  searchOptions.category1Id = item.id;
  const ids = new Array(1).fill(item.id);
  store.dispatch('setCategoryIds', ids);
  Object.assign(state, {
    checkedList: [],
    indeterminate: false,
  });
};

const handleClickCategory2 = (item) => {
  searchOptions.category2Id = item.id;
  const ids = new Array(1).fill(item.id);
  store.dispatch('setCategoryIds', ids);
  Object.assign(state, {
    checkedList: [],
    indeterminate: false,
  });
};

onMounted(() => {
  getList(store.getters.categoryIds);
});
</script>

<style lang="less" scoped>
a {
  color: black;
}
a:hover {
  color: #fb6e23;
}
.page {
  background-color: #f6f6f6;
}

.active {
  color: #fb6e23;
}
.head {
  padding-bottom: 24px;
  background-color: white;
  .header-content {
    width: 1200px;
    margin: 0 auto;
    .header-content-item {
      display: flex;
      align-items: center;
      background-color: #f6f6f6;
      align-items: flex-start;
      padding: 16px 24px;
      margin-bottom: 8px;
      .title {
        width: 80px;
        flex-basis: 80px;
        font-weight: 700;
      }
      .bars {
        display: flex;
        flex: 1;
        flex-wrap: wrap;
        gap: 16px 24px;
        .bar {
          position: relative;
          display: flex;
          justify-content: center;
          .triangle {
            top: 36px;
            width: 0;
            height: 0;
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            border-bottom: 10px solid #f6f6f6;
            position: absolute;
          }
        }
      }
    }
  }
}

.body {
  margin: 0 auto;
  width: 1200px;
  min-height: 255px;
  display: flex;
  padding: 24px 0;
  flex-wrap: wrap;
  gap: 8px;

  .goods-bar {
    width: 233px;
    height: 296px;
    background: white;
    display: flex;
    flex-direction: column;
    align-items: center;

    .article {
      margin-top: 15px;
      width: 200px;
      // height: 48px;
      text-align: center;
      font-weight: 600;
      line-height: 24px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .price {
      color: #fb6e23;
      font-size: 16px;
      font-weight: 700;
      margin-top: 10px;
    }

    .market-price {
      margin-top: 5px;
      color: #00000073;
    }
  }
}
</style>
