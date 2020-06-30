import Vue from 'vue'
import App from './App.vue'
import './plugins/oui.js'
import router from './router'
import store from './store'
import './plugins/base'
import vuetify from './plugins/vuetify'
import VuetifyDialog from 'vuetify-dialog'
import 'vuetify-dialog/dist/vuetify-dialog.css'
import i18n from './i18n'
import './assets/fonts/materialdesignicons.min.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueTimers from 'vue-timers'
import helper from './plugins/helper'
import ubus from './plugins/ubus'
import menu from './plugins/menu'
import uci from './plugins/uci'
import system from './plugins/system'
import session from './plugins/session'

Vue.config.productionTip = false

Vue.use(VueAxios, axios)
Vue.use(VueTimers)
Vue.use(ubus)
Vue.use(menu)
Vue.use(uci)
Vue.use(system)
Vue.use(session)
Vue.use(helper)
Vue.use(VuetifyDialog, {
    context: {
    vuetify
    }
})
new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount('#app')
