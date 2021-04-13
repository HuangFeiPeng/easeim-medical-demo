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
            <van-field v-model="username" name="用户名" placeholder="用户名" />
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
                :class="agree_protocol ? 'agree_btn_click' : 'agree_btn'"
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
        @click=";(isLogin = !isLogin), (agree_protocol = false)"
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
      username: 'hfp',
      password: '1',
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
    toLogin() {
      let that = this
      if (!this.username && !this.password) {
        this.$Toast('什么都没写！')
      } else if (!this.username) {
        this.$Toast('用户ID为空！')
      } else if (!this.password) {
        this.$Toast('密码为空！')
      }else if(this.$store.state.loginState){
        this.$Toast('已为登陆状态')
        this.$router.push('/home')
      }else {
        console.log('登陆中')
        this.$Toast.loading({
          message: '加载中...',
          forbidClick: true,
        })
        let options = {
          user: this.username,
          pwd: this.password,
          appKey: this.$WebIM.config.appkey,
          success() {
            that.$Toast.clear()
            that.username = ""
            that.password = ""
          },
        }
        this.$conn.open(options)
      }
    },
    toRegister() {
      let that = this;
      if (!this.username && !this.password && !this.confirmPwd) {
        this.$Toast('什么都没写！')
      } else if (!this.username) {
        this.$Toast('用户ID为空！')
      } else if (!this.password) {
        this.$Toast('密码为空！')
      } else if (!this.confirmPwd) {
        this.$Toast('首次输入密码为空！')
      } else if (!this.confirmPwd) {
        this.$Toast('确认密码为空！')
      } else if (this.password !== this.confirmPwd) {
        this.$Toast('两次密码不一致！')
      } else if (!this.agree_protocol) {
        this.$Toast('请勾选用户协议')
      } else {
        // console.log('注册中')
        let options = {
          username: this.username,
          password: this.password,
          nickname: 'nickname', //暂时不用
          appKey: this.$WebIM.config.appkey,
          success: function() {
            that.$Toast.success('注册成功！');
          },
          error: function(e) {
            if (JSON.parse(e.data).error == "duplicate_unique_property_exists") {
            that.$Toast.fail(`用户名已存在`)
          } else if (JSON.parse(e.data).error == "illegal_argument") {
            if (JSON.parse(e.data).error_description === "USERNAME_TOO_LONG") {
              that.$Toast.fail('注册ID超过64个字节！')
            }
            that.$Toast.fail('注册ID不合法')
          } else if (JSON.parse(e.data).error == "unauthorized") {
            that.$Toast.fail('未开放注册模式！')
          } else if (JSON.parse(e.data).error == "resource_limited") {
            that.$Toast.fail('该Appkey用户注册数量已达上限,请升级至企业版！')
          }
          },
        }
       this.$conn.registerUser(options)
      }
    },
  },
}
</script>
<style lang="scss" scoped></style>
