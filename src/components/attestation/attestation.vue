<template>
  <div class="attestation">
    <van-nav-bar class="nav_bar" fixed>
      <template #title>
        <!-- <van-icon name="search" size="18" /> -->
        <p v-text="title" class="text"></p>
      </template>
    </van-nav-bar>
    <div class="attestation_box">
      <!-- <vueScroll :ops="OPS"> -->
      <div class="attestation_box_header">
        <span class="img"></span>
        <p class="text">医师认证成功</p>
      </div>
      <div class="attestation_box_profile">
        <p class="text">医生头像</p>
        <img
          src="../../assets/imgs/占位01.jpeg"
          alt=""
        />
      </div>
      <div class="attestation_box_ID">
        <p class="text">身份证件(正反面需均需上传)</p>
        <div class="img_box">
          <img
            src="../../assets/imgs/占位02.jpeg"
            alt=""
          />
          <img
            src="../../assets/imgs/占位03.jpeg"
            alt=""
          />
        </div>
      </div>
      <div class="attestation_box_certificate">
        <p class="text"><b>*</b>胸牌/执业证/资格证/职称证，至少上传一项</p>
        <img
          src="../../assets/imgs/占位01.jpeg"
          alt=""
        />
        <p class="tip">照片仅用作认证，平台会保护您的隐私，不会泄露给第三方</p>
      </div>
      <div class="modify_btn_box">
        <van-button
          type="default"
          class="modify_btn"
          @click="changeBtn"
          color="linear-gradient(169deg, #07C193 0%, #3EAAB4 100%)"
          >修改认证</van-button
        >
      </div>

      <!-- </vueScroll> -->
    </div>
  </div>
</template>
<script>
import './attestation.scss'
export default {
  name: 'Attestation',
  data() {
    return {
      title: '医师认证'
    }
  },
  methods: {
    changeBtn(){
      this.$Toast.fail('暂不支持修改认证！')
    }
  },
}
</script>
<style lang="scss" scoped>
.attestation {
  background: #f7f8fa;
  overflow: hidden;
}
// @import url('./attestation.scss');
.nav_bar {
  background: #f7f8fa;
  .text {
    color: #535568;
  }
}
</style>
