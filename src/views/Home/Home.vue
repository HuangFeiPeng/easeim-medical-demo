<template>
  <div class="home">
    <!-- <p>home</p> -->
    <router-view />
    <van-tabbar
      class="tab_bar"
      active-color="#22ac9c"
      inactive-color="#494b5c"
      route
    >
      <van-tabbar-item replace to="/home/conversation" badge="1" icon="wap-home"
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
export default {
  name: 'Home',
  data() {
    return {
      active: 0,
      icon: {
        active: 'https://img01.yzcdn.cn/vant/user-active.png',
        inactive: 'https://img01.yzcdn.cn/vant/user-inactive.png',
      },
    }
  },
}
</script>
<style lang="scss" scoped>
@import url('./Home.scss');

.tab_bar {
  background: #f7f8fa;
  .van-tabbar-item--active {
    background-color: #f7f8fa;
  }
}
</style>
