import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loginState:false,
  },
  mutations: {
    changeUserState:(state,payload)=>{
      console.log(state,payload);
      const {condition} = payload;
      if (condition === "loginSuccess") {
        console.log('修改为登陆成功');
        state.loginState = true
      }else{
        state.loginState = false
      }
    }
  },
  actions: {
  },
  modules: {
  }
})
