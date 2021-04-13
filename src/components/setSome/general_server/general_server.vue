<template>
  <div class="general_server">
    <van-nav-bar class="nav_bar" fixed>
      <template #title>
        <p v-text="title" class="text"></p>
      </template>
      <template #left>
        <van-icon
          @click="$router.go(-1)"
          name="arrow-left"
          size="25"
          color="#333"
        />
      </template>
    </van-nav-bar>
    <!-- 通用设置各功能使用 -->
    <div class="general_server_main">
      <div class="setNotice van-hairline--bottom">
        <p>会话消息通知</p>
        <van-switch
          v-model="checked"
          size="24"
          active-color="#25B4A5"
          inactive-color="#dcdee0"
        />
      </div>
      <div class="change_pwd van-hairline--bottom" >
        <p>修改密码</p>
        <van-icon class="icon_arrow" name="arrow" size="20" @click="$Toast.fail({message:'暂不支持修改密码！',icon:'warning'})"/>
      </div>
      <div class="logout van-hairline--bottom">
        <p>注销账号</p>
        <van-icon class="icon_arrow" name="arrow" size="20" @click="$Toast.fail({message:'请联系客服注销',icon:'warning'})"/>
      </div>
      <div class="exit_box">
        <button class="btn" @click="letExit">退出登录</button>
      </div>
    </div>
  </div>
</template>
<script>
import './general_server.scss'
export default {
  data() {
    return {
      title: '通用设置',
      checked: false,
      isShowChangePwd:false
    }
  },
  watch: {
    checked(newVal,oldVal){
      if (newVal===true) {
        this.$Toast.success({
          icon:'passed',
          message:'已开启'
        })
      } else {
         this.$Toast.success({
          icon:'close',
          message:'已关闭'
        })
      }
    }
  },
  methods: {
    letExit(){
      this.$conn.close();
    }
  }
}
</script>
