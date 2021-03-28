import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import {
  Button,
  Form,
  Field,
  Cell,
  CellGroup
} from 'vant';

import './utils/rem'
Vue.use(Button);
Vue.use(Cell);
Vue.use(Form)
Vue.use(CellGroup)
Vue.use(Field)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')