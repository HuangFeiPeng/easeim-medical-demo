import Vue from 'vue'
import Vuex from 'vuex'
import Setting from './setting';
import Conversation from './conver';
import Message from './message';
import Agroa from './agroa';
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    allReadNumConut: 0,
    loginState: false,
  },
  mutations: {
    changeUserState: (state, payload) => {
      console.log(state, payload);
      const {
        condition
      } = payload;
      if (condition === "loginSuccess") {
        console.log('修改为登陆成功');
        state.loginState = true
      } else {
        state.loginState = false
      }
    },
    addAllReadNumCount: (state, num) => {
      state.allReadNumConut += num;
    }
  },
  actions: {},
  modules: {
    Setting,
    Conversation,
    Message,
    Agroa
  }
})