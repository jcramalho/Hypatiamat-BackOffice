import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import Vuex from 'vuex'
import VueSimpleAlert from "vue-simple-alert";
import VueCookies from 'vue-cookies'

Vue.use(VueSimpleAlert);

Vue.config.productionTip = false

Vue.use(VueCookies)

Vue.use(Vuex)

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
