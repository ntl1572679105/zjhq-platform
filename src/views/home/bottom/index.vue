<template>
  <div class="view">
    <div class="content">
      <div class="left">
        <img src="@/assets/images/Home/logo_haoguanjia_white@2x.png" alt="" class="logo1" />
        <img src="@/assets/images/Home/logo_zhehaotao_white@2x.png" alt="" class="logo2" />
        <div class="code">
          <img src="@/assets/images/Home/img_code@2x.png" alt="" class="" />
          <div class="code-text">浙好淘公众号</div>
        </div>
      </div>
      <div class="right">
        <div class="serve">
          <div class="serve-text1">服务中心</div>
          <div class="serve-text2 link-text">采购指南</div>
        </div>
        <div class="concat">
          <div class="concat-text1">联系我们</div>
          <div class="concat-phone">400-000-0000</div>
          <div class="concat-text2">全国服务热线</div>
        </div>
      </div>
    </div>
    <div class="copyright">Copyright © 2023 浙好淘供应链有限公司保留所有权利</div>
  </div>
</template>

<script setup>
// import xx from "../../../assets"
</script>

<style lang="less" scoped>
.view {
  width: 100%;
  height: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: url(../../../assets/images/Home/img_bg@2x.png);
  .content {
    position: relative;
    display: flex;
    justify-content: space-between;
    width: 1200px;
    height: 220px;
    margin-top: 55px;
    .left {
      .logo1 {
        width: 163px;
        height: 40px;
        position: absolute;
        top: 0;
        left: 0;
      }
      .logo2 {
        width: 112px;
        height: 38px;
        position: absolute;
        top:70px;
        left: 0;
      }
      .code {
        position: absolute;
        top: 0;
        left: 240px;
        text-align: center;
        img {
          width: 114px;
          height: 114px;
        }
        &-text {
          color: white;
          margin-top: 10px;
        }
      }
    }

    .right {
      display: flex;
      .serve {
        text-align: center;
        margin-right: 100px;
        .serve-text1 {
          font-size: 22px;
          color: #fff;
        }
        .serve-text2 {
          margin-top: 15px;
          font-size: 16px;
          color: #ffffff73;
        }
      }

      .concat {
        text-align: center;
        .concat-text1 {
          font-size: 22px;
          color: #fff;
        }
        .concat-phone {
          margin-top: 10px;
          font-size: 32px;
          color: #ff7019;
        }
        .concat-text2 {
          margin-top: 10px;
          font-size: 16px;
          color: #ffffff73;
        }
      }
    }
  }
  .copyright {
    // position: absolute;
    color: #ffffff73;
  }
}

.link-text {
  cursor: pointer;
}
.link-text:hover {
  color: #fb6e23 !important;
}
</style>
