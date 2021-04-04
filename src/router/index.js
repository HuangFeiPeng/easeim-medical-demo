import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: "/login"
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

  }
]

const router = new VueRouter({
  routes
})

export default router
