<template>
  <div class="band">
    <header>
      <div class="right">
        <img src="@/assets/images/Home/home_icon_3@2x.png" style="width: 50px; height: 50px" />
        <span class="title">品牌促销</span>
      </div>
      <div class="left" @click="goSearchRoute">
        <span> 查看全部 </span>
        <right-outlined />
      </div>
    </header>

    <div class="content">
      <div class="band-bar" v-for="item in bandList" :key="item.id">
        <img
          :src="item.mainUrl || 'https://picsum.photos/200/300?id=022'"
          style="
            width: 116px;
            height: 116px;
            margin-top: 40px;
            border-radius: 4px;
            object-fit: cover;
          "
        />
        <div class="article">{{ item.productName }}</div>
        <div class="price">￥{{ item.taxPrice }}</div>
        <!-- <div class="market-price">市场价：¥6078.00</div> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { recommenderPage } from '@/api/home';

const router = useRouter();

const bandList = ref([]);

const getBandList = () => {
  const params = {
    pageNum: 1,
    pageSize: 5,
    type: 1,
    status: 0,
  };
  recommenderPage(params).then((res) => {
    bandList.value = res.data;
  });
};

const goSearchRoute=()=>{
  router.push('/search');
}

onMounted(() => {
  getBandList();
});
</script>

<style lang="less" scoped>
.band {
  padding-top: 25px;
}

.content {
  display: flex;
  gap: 8px;
  .band-bar {
    width: 233px;
    height: 296px;
    background: #f6f6f6;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid #fff;
    transition: 0.3s all;
    cursor: pointer;

    &:hover {
      border: 1px solid #fb6e23;
      box-shadow: 0 2px 6px 0 #0000000a, 0 4px 16px 0 #0000000d;
    }

    .article {
      margin-top: 15px;
      width: 200px;
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
