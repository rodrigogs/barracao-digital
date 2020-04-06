import 'normalize.css';
import '@/assets/main.css';
import Vue from 'vue';
import VueAnnouncer from 'vue-announcer';
import VueCookie from 'vue-cookie';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import './plugins/noty';
import './registerServiceWorker';
import vuetify from './plugins/vuetify';

Vue.use(VueAnnouncer, {}, router);
Vue.use(VueCookie);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
