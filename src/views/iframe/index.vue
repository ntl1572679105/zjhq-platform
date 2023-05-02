<template>
  <div style="height: calc(100vh - 109px)">
    <iframe
      :src="$route.meta.menuUrl"
      style="height: calc(100vh - 104px); width: 100%; background: #fff; border-radius: 12px"
      frameborder="no"
      border="0"
      marginWidth="0"
      marginHeight="0"
      ref="iframe"
    >
    </iframe>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  data() {
    return {
      routerMap: {},
    };
  },
  computed: {
    ...mapGetters(['addRouters']),
  },
  mounted() {
    window.addEventListener('message', this.handleMessage);
  },
  watch: {
    '$route.meta.menuUrl': {
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            this.$refs.iframe.contentWindow.location.replace(val);
          });
        }
      },
      immediate: true,
      deep: true,
    },
  },
  destroyed() {
    this.removeListen();
  },
  methods: {
    ...mapActions(['Logout', 'getNewToken']),
    handleMessage(val) {
      if (val.data.code === '2004' || val.data.code === 2004) {
        this.getNewToken()
          .then((res) => {
            this.$refs.iframe.contentWindow.postMessage(
              { APP_CONFIG: window.APP_CONFIG, type: 'getNewToken' },
              '*',
            );
          })
          .catch(() => {
            setTimeout(() => {
              this.removeListen();
              this.Logout();
            }, 1000);
          });
      } else if (val.data.type === 'getAppConfig') {
        this.$refs.iframe.contentWindow.postMessage({ APP_CONFIG: window.APP_CONFIG }, '*');
      } else if (val.data.type === 'toIframeRoute' && val.data.code) {
        this.toIframeRoute(val.data.code);
      }
    },
    getRoute(arr) {
      for (const i in arr) {
        this.routerMap[arr[i].code] = arr[i];
        if (arr[i].childList && arr[i].childList.length) {
          this.getRoute(arr[i].childList);
        }
      }
    },
    toIframeRoute(code) {
      this.getRoute(this.addRouters[0].children, code);
      if (this.routerMap[code]?.path) {
        this.$router.push({
          path: this.routerMap[code].path,
        });
      }
    },
    removeListen() {
      window.removeEventListener('message', this.handleMessage);
    },
  },
};
</script>

<style></style>
