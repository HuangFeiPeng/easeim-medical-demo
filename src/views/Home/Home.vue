<template>
  <!-- 会话列表部分 -->
  <div class="home">
    <!-- nav部分 不用动 -->
    <van-nav-bar class="nav_bar" fixed>
      <template #title>
        <p v-text="$route.meta.title" class="text"></p>
      </template>
    </van-nav-bar>
    <router-view />
    <van-tabbar
      class="tab_bar"
      active-color="#22ac9c"
      inactive-color="#494b5c"
      route
    >
      <van-tabbar-item
        replace
        to="/home/conversation"
        icon="wap-home"
        :badge="
          allUnReadNumCont && allUnReadNumCont > 0
            ? allUnReadNumCont > 99
              ? '99+'
              : allUnReadNumCont
            : ''
        "
        >首页</van-tabbar-item
      >
      <van-tabbar-item replace to="/home/attestation" icon="manager"
        >我的认证</van-tabbar-item
      >
      <van-tabbar-item replace to="/home/setSome" icon="setting"
        >设置</van-tabbar-item
      >
    </van-tabbar>
  </div>
</template>
<script>
import "./Home.scss";
import { mapState } from "vuex";
export default {
  name: "Home",
  data() {
    return {
      title: "",
      active: 0,
      icon: {
        active: "https://img01.yzcdn.cn/vant/user-active.png",
        inactive: "https://img01.yzcdn.cn/vant/user-inactive.png"
      }
    };
  },
  computed: {
    // allUnReadNumCont
    ...mapState({
      allUnReadNumCont: state => state.allReadNumConut
    })
  },
  methods: {}
};
</script>
