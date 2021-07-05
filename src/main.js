import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import WebIM from './utils/WebIM'
const bus = new Vue();
// 引入Vconsole
import Vconsole from 'vconsole'
// new Vconsole();
import './utils/rem.js' //rem布局进行的配置
// import './mock/index';
// require('./mock/index');

//Vant UI的按需引入
import {
  Col,
  Row,
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
  Switch,
  Empty,
  Tag,
  NoticeBar,
  Sticky,
  PullRefresh,
  Popup,
  Badge,
  Loading,
  Notify,
  ActionSheet
} from 'vant';
import {
  Image as VanImage
} from 'vant';
Vue.use(VanImage)
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
Vue.use(Empty)
Vue.use(Tag)
Vue.use(NoticeBar)
Vue.use(Sticky)
Vue.use(Col)
Vue.use(Row)
Vue.use(PullRefresh).use(Popup).use(Badge).use(Loading).use(Notify).use(ActionSheet)
Vue.prototype.$Toast = Toast
Vue.prototype.$Notify = Notify
Vue.prototype.$WebIM = WebIM
Vue.prototype.$conn = WebIM.conn
Vue.prototype.$RTC = WebIM.AgoraRTC
Vue.prototype.$Bus = bus
Vue.config.productionTip = false

window.Vue = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')