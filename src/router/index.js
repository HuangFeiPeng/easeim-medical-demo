import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index';
Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: "/login" //默认重定向为登陆
  },
  //登陆
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: '登陆'
    },
    component: () => import( /* webpackChunkName: "about" */ '../views/Login/Login.vue')
  },
  //home页，下属三个页面路由
  {
    path: '/home',
    name: 'Home',
    redirect: '/home/conversation', //设置重定向路由加载的指向路径，进入chat页面首先选中会话列表
    meta: {
      title: '首页'
    },
    component: () => import( /* webpackChunkName: "about" */ '../views/Home/Home.vue'),
    children: [{
        path: 'conversation',
        name: 'Conversation',

        meta: {
          title: '问诊服务'
        },
        component: () => import('../components/conversation/conversation.vue')
      },
      {
        path: 'attestation',
        name: 'Attestation',
        meta: {
          title: '认证服务'
        },
        component: () => import('../components/attestation/attestation.vue')
      },
      {
        path: 'setSome',
        name: 'SetSome',
        meta: {
          title: '个人设置'
        },
        component: () => import('../components/setSome/setting.vue'),
      },
    ]
  },
  {
    path: '/inquiry_server',
    name: 'Inquiry_server',
    component: () => import('../components/setSome/inquiry_server/inquiry_server.vue')

  },
  {
    path: '/general_server',
    name: 'General_server',
    component: () => import('../components/setSome/general_server/general_server.vue')

  },
  //患者详情
  {
    path: '/disposeClinical',
    name: 'DisposeClinical',
    meta: {
      title: '患者详情'
    },
    component: () => import('../components/conversation/disposeClinical/index.vue'),
    children: [{
      path: 'chat_content',
      name: 'ChatContent',
      meta: {
        title: '开始问诊'
      },
      component: () => import('../components/conversation/chat/chat_content/chat_content.vue')
    }]
  },
  //退诊部分
  {
    path: '/refuseReception',
    name: 'RefuseReception',

    meta: {
      title: '退诊原因'
    },
    component: () => import('../components/conversation/disposeClinical/refuseReception.vue')
  },
  //音频通话
  {
    path: '/audioCall',
    name: 'AudioCall',
    component: () => import('../components/agoraVideo/audioCall/audioCall.vue')
  },
  {
    path: '/videoCall',
    name: 'VideoCall',
    component: () => import('../components/agoraVideo/videoCall/videoCall.vue')
  }
]


const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  let loginState = store.state.loginState;
  if (to.name) {
    next()
    if (!loginState && to.name !== 'Login') {
      next('/login')
      console.log('>>>>未登录');
    }
  }

})

export default router