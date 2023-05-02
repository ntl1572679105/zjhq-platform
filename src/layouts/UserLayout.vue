<template>
  <div id="userLayout" className="user-layout-wrapper">
    <div className="container">
      <div className="user-layout-content">
        <!-- <div class="top">
          <div class="header">
            <a href="/">
              <span class="title">管理系统</span>
            </a>
          </div>
        </div> -->

        <router-view />

        <!-- <div class="footer">
          <div class="copyright">Copyright &copy; 2022 管理系统</div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserLayout',
  mounted() {
    document.body.classList.add('userLayout');
  },
  beforeDestroy() {
    document.body.classList.remove('userLayout');
  },
};
</script>

<style lang="less" scoped>
#userLayout.user-layout-wrapper {
  height: 100%;

  &.mobile {
    .container {
      .main {
        max-width: 368px;
        width: 98%;
      }
    }
  }

  .container {
    width: 100%;
    min-height: 100%;
    //background: #1791ff;
    background: #f0f2f5 url('../assets/images/backgound1.png') no-repeat 50%;
    background-size: 100% 100%;
    //padding: 50px 0 84px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    .user-layout-lang {
      width: 100%;
      height: 40px;
      line-height: 44px;
      text-align: right;

      .select-lang-trigger {
        cursor: pointer;
        padding: 12px;
        margin-right: 24px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        vertical-align: middle;
      }
    }

    .user-layout-content {
      .main {
        min-width: 260px;
        width: 480px;
        margin: 0 auto;
      }
    }

    a {
      text-decoration: none;
    }
  }
}
</style>
