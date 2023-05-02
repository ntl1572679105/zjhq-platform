const VueAxios = {
  vm: {},
  // eslint-disable-next-line no-unused-vars
  install(app, instance) {
    if (this.installed) {
      return;
    }
    this.installed = true;

    if (!instance) {
      // eslint-disable-next-line no-console
      console.error('You have to install axios');
      return;
    }

    app.axios = instance;

    // Object.defineProperties(app.prototype, {
    //   axios: {
    //     get: function get() {
    //       return instance;
    //     },
    //   },
    //   $http: {
    //     get: function get() {
    //       return instance;
    //     },
    //   },
    // });
  },
};

export { VueAxios };
