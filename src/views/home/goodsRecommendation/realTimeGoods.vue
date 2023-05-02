<template>
  <div class="view">
    <header>
      <div class="right">
        <img src="@/assets/images/Home/home_icon_4@2x.png" style="width: 50px; height: 50px" />
        <span class="title">实时价格参考</span>
      </div>
      <div class="left">
        <span> 查看全部 </span>
        <right-outlined />
      </div>
    </header>

    <div class="content">
      <div class="bar" v-for="item in imgList" :key="item">
        <img :src="item.url" alt="" style="width: 100px; height: 100px" />
        <div class="right">
          <div class="name">{{ item.name }}</div>
          <div class="price-info">
            <span>
              <span class="price-type">平台价：</span>
              <span class="main-price">￥2,354.1</span>
            </span>
            <span class="ml-5">
              <span class="price-type">市场价：</span>
              <span class="market-price">￥3,535.3</span>
            </span>
          </div>
          <div class="comparison">
            <span class="title">对比：</span>
            <span class="number">-6.32%</span>
            <img
              src="@/assets/images/Home/icon-home-up@2x.png"
              alt=""
              style="width: 16px; height: 16px"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const imgList = [
  { name: '惠普打印机', url: new URL('@/assets/images/Home/price_1@2x.png', import.meta.url).href },
  { name: '保险柜/箱', url: new URL('@/assets/images/Home/price_2@2x.png', import.meta.url).href },
  { name: '条码扫描', url: new URL('@/assets/images/Home/price_3@2x.png', import.meta.url).href },
  { name: '摄像头', url: new URL('@/assets/images/Home/price_4@2x.png', import.meta.url).href },
  { name: '投影仪', url: new URL('@/assets/images/Home/price_5@2x.png', import.meta.url).href },
  { name: '鼠标', url: new URL('@/assets/images/Home/price_6@2x.png', import.meta.url).href },
  {
    name: '装订/封装机',
    url: new URL('@/assets/images/Home/price_7@2x.png', import.meta.url).href,
  },
  { name: '收银机', url: new URL('@/assets/images/Home/price_8@2x.png', import.meta.url).href },
  { name: '摄像机', url: new URL('@/assets/images/Home/price_9@2x.png', import.meta.url).href },
];
</script>

<style lang="less" scoped>
.view {
  margin-top: 25px;
  padding-bottom: 25px;
}

.content {
  display: flex;
  flex-wrap: wrap;
}

.bar {
  display: flex;
  width: 400px;
  height: 130px;
  padding: 12px 22px;
  border-right: 1px dashed #e5e5e5;
  border-bottom: 1px dashed #e5e5e5;
  cursor: pointer;

  .right {
    margin-left: 10px;

    .name {
      font-size: 16px;
      font-weight: 500;
    }

    .price-info {
      margin-top: 5px;

      .price-type {
        font-size: 12px;
        color: #000000a6;
      }

      .main-price {
        font-size: 16px;
        color: #f2461e;
      }

      .market-price {
        font-size: 12px;
        color: #000000d9;
        font-weight: 500;
      }
    }

    .comparison {
      display: flex;
      align-items: center;
      width: fit-content;
      height: 32px;
      padding: 5px 12px;
      margin-top: 10px;
      background: #f6f6f6;
      border-radius: 2px;

      .title {
        color: #00000073;
      }

      .number {
        color: #000000d9;
        font-weight: 700;
        margin-right: 5px;
      }
    }
  }
}

.bar:nth-child(3n) {
  border-right: none;
}

.bar:nth-last-of-type(-n + 3) {
  border-bottom: none;
}
</style>
