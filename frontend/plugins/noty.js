import Vue from 'vue'
import VueNoty from 'vuejs-noty'
import 'vuejs-noty/dist/vuejs-noty.css'

export default () => {
  Vue.use(VueNoty, {
    timeout: 2500,
    theme: 'metroui',
    layout: 'bottomCenter',
    progressBar: true,
  })
}
