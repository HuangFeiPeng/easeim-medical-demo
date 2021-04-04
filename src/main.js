import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import WebIM from'./utils/WebIM'
import vuescroll from "vuescroll/dist/vuescroll-slide" //滚动插件


import './utils/rem.js' //rem布局进行的配置
//Vant UI的按需引入
import {
  Button,
  Icon,
  Form,
  Field,
  Cell,
  CellGroup,
  Toast,
  Tabbar,
  TabbarItem,
  NavBar,
  Switch
} from 'vant';

Vue.use(WebIM)
Vue.use(vuescroll)
Vue.use(Button)
Vue.use(Cell)
Vue.use(Form)
Vue.use(CellGroup)
Vue.use(Field)
Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(NavBar)
Vue.use(Icon)
Vue.use(Switch)
Vue.prototype.$Toast = Toast
Vue.prototype.$WebIM = WebIM
Vue.prototype.$conn = WebIM.conn
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')