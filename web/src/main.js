import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import '@babel/polyfill'
import VImageInput from "vuetify-image-input";
import SweetModal from 'sweet-modal-vue/src/plugin.js'

Vue.config.productionTip = false
Vue.component(VImageInput.name, VImageInput);
Vue.use(SweetModal);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
