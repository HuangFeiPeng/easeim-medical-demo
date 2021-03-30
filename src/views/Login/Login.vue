<template>
  <div class="login">
    <header>
      <div class="login_header">
        <div class="logo"></div>
        <div class="cut_line"></div>
        <div class="heading_title">
          医疗 Demo
        </div>
      </div>
    </header>
    <main>
      <!-- 登陆部分 -->
      <div class="login_input_box" v-if="isLogin">
        <van-form autocomplete="off" class="input_form">
          <div>
            <span class="input_title">用户名/room</span>
            <van-field
              v-model="username"
              name="用户名"
              placeholder="用户名"
            />
          </div>
          <div class="input_pwd_box">
            <span class="input_title" id="input_title_pwd">密码/key</span>
            <van-field
              class="input_pwd"
              v-model="password"
              :type="type ? 'password' : 'text'"
              name="密码"
              placeholder="密码"
            />
            <div
              @click.stop=";(isShowPwd = !isShowPwd), (type = !type)"
              class="show_eyes"
            >
              <img :src="isShowPwd ? pwdImg.showPwd : pwdImg.hidePwd" />
            </div>
          </div>

          <div>
            <van-button
              class="login_button"
              color="linear-gradient(166deg, #07C193 0%, #3EAAB4 100%)"
              round
              block
              type="info"
              native-type="submit"
              @click="toLogin"
              >登陆</van-button
            >
          </div>
        </van-form>
      </div>
      <!-- 注册部分 -->
      <div class="regiser_input_box" v-else>
        <van-form autocomplete="off" class="input_form">
          <div>
            <span class="input_title">用户名/room</span>
            <van-field
              v-model="username"
              name="用户名"
              placeholder="用户名"
              clearable
            />
          </div>
          <div class="input_pwd_box fist_input_pwd">
            <span class="input_title" id="input_title_pwd">密码/key</span>
            <van-field
              class="input_pwd"
              v-model="password"
              :type="type ? 'password' : 'text'"
              name="密码"
              placeholder="密码"
            />
            <div
              @click.stop=";(isShowPwd = !isShowPwd), (type = !type)"
              class="show_eyes"
            >
              <img :src="isShowPwd ? pwdImg.showPwd : pwdImg.hidePwd" />
            </div>
          </div>
          <div class="input_pwd_box last_input_pwd">
            <span class="input_title">确认密码/key</span>
            <van-field
              class="input_pwd"
              v-model="confirmPwd"
              :type="type ? 'password' : 'text'"
              name="密码"
              placeholder="密码"
            />
            <div
              @click.stop=";(isShowPwd = !isShowPwd), (type = !type)"
              class="show_eyes"
            >
              <img :src="isShowPwd ? pwdImg.showPwd : pwdImg.hidePwd" />
            </div>
            <div class="agree_box">
              <span
                :class="agree_protocol ?'agree_btn_click':'agree_btn'"
                @click="agree_protocol = !agree_protocol"
              ></span>
              <p>同意环信服务条款与环信隐私协议</p>
            </div>
          </div>

          <div>
            <van-button
              class="login_button"
              color="linear-gradient(166deg, #07C193 0%, #3EAAB4 100%)"
              @click="toRegister"
              round
              block
              type="info"
              native-type="submit"
              >注册</van-button
            >
          </div>
        </van-form>
      </div>
      <div
        class="toggle_state"
        @click="isLogin = !isLogin,agree_protocol = false"
        v-text="isLogin ? '注册账号' : '返回登陆'"
      >
        注册账号
      </div>
    </main>
    <footer>
      <p class="statement_text">本产品由环信提供 当前版本：1.4.1</p>
    </footer>
  </div>
</template>
<script>
import './Login.scss'
export default {
  name: 'Login',
  data() {
    return {
      isLogin: true, //0 登陆 1 注册
      username: '',
      password: '',
      confirmPwd: '',
      isShowPwd: false,
      agree_protocol: false,
      pwdImg: {
        showPwd: require('../../assets/imgs/icon／展示密码备份 2@2x.png'),
        hidePwd: require('../../assets/imgs/icon／不展示密码@2x.png'),
      },
      type: true,
    }
  },
  methods: {
    toLogin(){
      if (!this.username && !this.password) {
        this.$Toast('什么都没写！');
      }else if (!this.username) {
        this.$Toast('用户ID为空！');
      }else if(!this.password){
        this.$Toast('密码为空！')
      }else{
        console.log('登陆中');
      }
    },
    toRegister(){
      if (!this.username && !this.password &&!this.confirmPwd) {
        this.$Toast('什么都没写！');
      }else if (!this.username) {
        this.$Toast('用户ID为空！');
      }else if(!this.password){
        this.$Toast('fist密码为空！')
      }else if(!this.confirmPwd){
        this.$Toast('last密码为空！')
      }else if(!this.confirmPwd){
        this.$Toast('last密码为空！')
      }else if(this.password !== this.confirmPwd){
        this.$Toast('两次密码不一致！')
      }else if(!this.agree_protocol){
        this.$Toast('请勾选用户协议')
      }else{
        console.log('注册中');
      }
    }
  },
}
</script>
<style lang="scss" scoped></style>
