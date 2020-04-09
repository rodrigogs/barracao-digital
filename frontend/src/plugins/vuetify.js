import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import pt from 'vuetify/lib/locale/pt';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdiSvg', // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
  },
  lang: {
    locales: { pt },
    current: 'pt',
  },
});
