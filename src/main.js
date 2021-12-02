import Vue from 'vue';
import YmapPlugin from 'vue-yandex-maps';
import MAP_SETTINGS from '@/constants/yandex-map';
import App from './App.vue';

import '@/assets/scss/base.scss';

import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

Vue.use(YmapPlugin, MAP_SETTINGS);

Object.defineProperty(Vue.prototype, '$bus', {
  get() {
    return this.$root.bus;
  },
});

/* eslint-disable vue/require-name-property */
new Vue({
  data: {
    bus: new Vue({}), // Here we bind our event bus to our $root Vue model.
  },
  vuetify,
  render: h => h(App),
}).$mount('#app');
