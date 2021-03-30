import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import {
  Button,
  Form,
  Field,
  Cell,
  CellGroup,
  Toast
} from 'vant';

import './utils/rem.js'

Vue.use(Button);
Vue.use(Cell);
Vue.use(Form)
Vue.use(CellGroup)
Vue.use(Field)
Vue.prototype.$Toast = Toast
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')