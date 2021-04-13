import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index';
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: "/login" //默认重定向为登陆
  },
  {
    path: '/login',
    name: 'Login',
    meta: { 
      title: '登陆'
     },
    component: () => import(/* webpackChunkName: "about" */ '../views/Login/Login.vue')
  },
  {
    path: '/home',
    name: 'Home',
    redirect:'/home/conversation',//设置重定向路由加载的指向路径，进入chat页面首先选中会话列表
    meta: { 
      title: '首页'
     },
    component: () => import(/* webpackChunkName: "about" */ '../views/Home/Home.vue'),
      children: [
        { 
          path: 'conversation',
          name:'Conversation',
          
          meta: { 
            title:'会话'
           },
           component: ()=> import('../components/conversation/conversation.vue')
        },
        { 
          path: 'attestation',
          name:'Attestation',
          meta: { 
            title:'认证'
           },
           component: ()=> import('../components/attestation/attestation.vue')
        },
        { 
          path: 'setSome',
          name:'SetSome',
          meta: { 
            title:'设置'
           },
           component: ()=> import('../components/setSome/setting.vue'),
        },
      ]
  },
  {
        path:'/inquiry_server',
        name:'Inquiry_server',
        component:() => import('../components/setSome/inquiry_server/inquiry_server.vue')

  },
  {
        path:'/general_server',
        name:'General_server',
        component:() => import('../components/setSome/general_server/general_server.vue')

  },
  {
        path:'/disposeClinical',
        name:'DisposeClinical',
        meta:{
          title:'患者详情'
        },
        component:() => import('../components/conversation/disposeClinical/index.vue')

  }
]


const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  let loginState = store.state.loginState;
  if (to.name) {
    next()
    if (!loginState && to.name !=='Login') {
      next('/login')
      console.log('>>>>未登录');
    }
  }
  
})

export default router
