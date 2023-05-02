<template>
  <div class="category" v-for="(item, index) in categoryData" :key="item.id">
    <header>
      <div class="right">
        <span class="title">{{ categoryNav[index].title }}</span>
        <span class="description">{{ categoryNav[index].description }}</span>
      </div>
      <div class="left" @click="goSearchRoute">
        <span> 查看全部 </span>
        <right-outlined />
      </div>
    </header>

    <div class="category-content">
      <div>
        <img :src="categoryNav[index].url" style="width: 100%; height: 100%" />
      </div>
      <div v-for="reclassify in item.children.slice(0, 4)" :key="reclassify.id" class="reclassify">
        <img
          :src="reclassify.imgUrl || 'https://picsum.photos/200/300'"
          style="width: 150px; height: 150px; border-radius: 4px; object-fit: cover"
        />
        <div class="reclassify-name">{{ reclassify.name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const router = useRouter();

const store = useStore();
const categoryData = computed(() => store.getters.category.slice(0,6));

const categoryNav = [
  {
    title: '综合食材',
    description: '保证品质 提高办公效率',
    url: new URL('@/assets/images/Home/img_food@2x.png', import.meta.url).href,
  },
  {
    title: '办公用品',
    description: '提供舒适办公体验',
    url: new URL('@/assets/images/Home/img_office@2x.png', import.meta.url).href,
  },
  {
    title: '酒店用品',
    description: '精选设备一站购齐',
    url: new URL('@/assets/images/Home/img_hotel@2x.png', import.meta.url).href,
  },
  {
    title: '餐厨用品',
    description: '精品餐具健康伴行',
    url: new URL('@/assets/images/Home/img_kitchen@2x.png', import.meta.url).href,
  },
  {
    title: '购买服务',
    description: '专注于品质，专心于健康',
    url: new URL('@/assets/images/Home/img_service@2x.png', import.meta.url).href,
  },
  {
    title: '其他',
    description: '休闲时尚，轻松便宜',
    url: new URL('@/assets/images/Home/img_another@2x.png', import.meta.url).href,
  },
];
 
const goSearchRoute=()=>{
  router.push('/search');
}

onMounted(() => {});
</script>

<style lang="less" scoped>
.category {
  margin-top: 35px;
}

.category-content {
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(5, 1fr);
  margin-top: 15px;
  & > div {
    height: 300px;
  }

  .reclassify {
    padding: 40px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
    border: 1px solid #fff;
    transition: 0.3s all;
    cursor: pointer;

    .reclassify-name {
      margin-top: 20px;
      font-size: 16px;
      font-weight: 700;
    }
    &:hover {
      border: 1px solid #fb6e23;
      box-shadow: 0 2px 6px 0 #0000000a, 0 4px 16px 0 #0000000d;
    }
  }
}
</style>
