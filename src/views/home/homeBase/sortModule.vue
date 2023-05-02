<template>
  <div class="sortModule">
    <nav>
      <section
        v-for="(item, index) in categoryData"
        :key="item.id"
        @mouseenter="showSlide(item, index)"
        @mouseleave="selectIndex = null"
        :class="selectIndex === index ? 'active' : ''"
      >
        <aside>
          <article>
            <span class="title">{{ item.name }}</span>
            <span
              style="color: rgba(255, 255, 255, 0.65); margin-left: 10px"
              v-for="secondType in item.children"
              :key="secondType.id"
            >
              {{ secondType.name }}
            </span>
          </article>
          <right-outlined style="width: 20px" :class="selectIndex === index ? 'pointer' : ''" />
        </aside>

        <Transition>
          <div
            class="nav-select animate__animated animate__fadeIn"
            v-show="selectIndex === index"
            :key="index"
          >
            <div class="nav-select-item" v-for="reclassify in item.children" :key="reclassify.id">
              <div class="reclassify">
                <span class="reclassify-text" @click.stop="handleCategoryClick(reclassify)">{{
                  reclassify.name
                }}</span>
                <right-outlined />
              </div>
              <div class="thirdClassify">
                <span
                  class="thirdClassify-text"
                  v-for="thirdClassify in reclassify.children"
                  :key="thirdClassify.id"
                  @click.stop="handleCategoryClick(thirdClassify)"
                >
                  {{ thirdClassify.name }}
                </span>
              </div>
            </div>
          </div>
        </Transition>
      </section>
    </nav>
    <a-carousel autoplay arrows style="width: 950px">
      <template #prevArrow>
        <div class="custom-slick-arrow" style="left: 10px; z-index: 1">
          <left-circle-outlined />
        </div>
      </template>
      <template #nextArrow>
        <div class="custom-slick-arrow" style="right: 10px">
          <right-circle-outlined />
        </div>
      </template>
      <div v-for="(item, index) in carousel" :key="index">
        <img :src="item" style="width: 950px; height: 412px" />
      </div>
    </a-carousel>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';

const router = useRouter();
const store = useStore();

const selectIndex = ref(null);
const categoryData = computed(() => store.getters.category);

const carousel = new Array(4).fill('https://picsum.photos/200/300');

const getCategoryData = () => {
  store.dispatch('getCategory');
};

const showSlide = (item, index) => {
  selectIndex.value = index;
};

const handleCategoryClick = (item) => {
  const ids = new Array(1).fill(item.id);
  store.dispatch('setCategoryIds', ids);
  router.push('/search');
};

onMounted(() => {
  getCategoryData();
});
</script>

<style scoped>
.ant-carousel {
  text-align: center;
  height: 412px;
  line-height: 412px;
  background: #364d79;
  overflow: hidden;
}

.ant-carousel :deep(.slick-arrow.custom-slick-arrow) {
  width: 25px;
  height: 25px;
  font-size: 25px;
  color: #fff;
  background-color: transparent;
  z-index: 1;
}
.ant-carousel :deep(.custom-slick-arrow:before) {
  display: none;
}
.ant-carousel :deep(.custom-slick-arrow:hover) {
  opacity: 0.5;
}
</style>

<style lang="less" scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.pointer {
  color: #fb6e23;
}
.sortModule {
  display: flex;
  flex-direction: row;
  height: 412px;
  margin-top: 10px;
}
nav {
  padding: 10px 0;
  background: rgba(0, 0, 0, 0.85);
  color: #fff;
  width: 250px;
  height: 412px;

  section {
    cursor: pointer;
    width: 100%;
    padding: 5px 0;

    aside {
      width: 100%;
      display: flex;
      align-items: center;
      article {
        width: 80%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .title {
          margin-left: 20px;
        }
      }
    }
  }
  section.active {
    background: #ffffff1a;
  }
}

.nav-select {
  background: #000000d9;
  padding: 12px 10px;
  position: absolute;
  z-index: 6;
  overflow: hidden;
  top: 0px;
  left: 250px;
  width: 950px;
  min-height: 412px;

  .nav-select-item {
    padding: 5px 0;
    display: flex;
    align-items: flex-start;
    .reclassify {
      width: 100px;
      flex-basis: 100px;
      display: flex;
      align-items: center;
      .reclassify-text {
        display: inline-block;
        width: 80px;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
        white-space: nowrap;
      }
      .reclassify-text:hover {
        color: #fb6e23;
      }
    }
    .thirdClassify {
      color: #ffffffa6;
      margin-left: 5px;
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      .thirdClassify-text:hover {
        color: #fb6e23;
      }
    }
  }
}
</style>
