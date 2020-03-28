import 'normalize.css';
import '@/assets/main.css';
import Vue from 'vue';
import VueAnnouncer from 'vue-announcer';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';

Vue.use(VueAnnouncer, {}, router);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
