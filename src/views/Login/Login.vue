<template>
  <div class="login">
    <header>
      <div class="login_header">
        <div class="logo">
          <img src="../../assets/logo@2x.png" />
        </div>
        <div class="cut_line"></div>
        <div class="heading_title">
          医疗 Demo
        </div>
      </div>
    </header>
    <main>
      <div class="login_input_box">
        <span class="input_title">用户名/room</span>
        <van-form autocomplete="off" class="input_form">
          <van-field
            v-model="username"
            name="用户名"
            placeholder="用户名"
            
          />
          <span class="input_title input_title_pwd">密码/key</span>
          <van-field
            v-model="password"
            :type="type ? 'password' : 'text'"
            name="密码"
            placeholder="密码"
          />
          <div @click.stop="isShowPwd = !isShowPwd,type = !type" class="show_eyes">
            <img :src="isShowPwd ? pwdImg.showPwd : pwdImg.hidePwd" />
          </div>
          <div>
            <van-button
              class="login_button"
              color="linear-gradient(166deg, #07C193 0%, #3EAAB4 100%)"
              round
              block
              type="info"
              native-type="submit"
              >登陆</van-button
            >
          </div>
        </van-form>
      </div>
      <div class="toggle_state">
          注册账号
      </div>
    </main>
    <footer>
        <p class="statement_text">本产品由环信提供  当前版本：1.4.1</p>
    </footer>
  </div>
</template>
<script>
import './Login.scss'
export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      isShowPwd: false,
      pwdImg: {
        showPwd: require('../../assets/imgs/icon／展示密码备份 2@2x.png'),
        hidePwd: require('../../assets/imgs/icon／不展示密码@2x.png'),
      },
      type: true,
    }
  },
}
</script>
<style lang="scss" scoped></style>
