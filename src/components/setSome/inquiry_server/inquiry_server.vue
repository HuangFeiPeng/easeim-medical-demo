<template>
  <div class="inquiry_server">
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
    <div class="clinical_reception_func">
      <div class="diagnosis_box">
        <div class="diagnosis_main_left">
          <span class="diagnosis_text">接诊开关</span>
          <p>已开启，患者可向您发起问诊</p>
        </div>
        <div class="diagnosis_main_right">
          <van-switch  v-model="checked" size="24" active-color="#25B4A5" inactive-color="#dcdee0"/>
        </div>
        
      </div>
      <!-- <div>问诊价格</div> -->
    </div>
    <!-- <div class="inquiryPrice_func"></div> -->
  </div>
</template>
<script>
import Storage from '@/utils/Storage'
export default {
  data() {
    return {
      title: '问诊服务设置',
      isShowInquiryPrice: false,
      inquiryPrice: 0,
      checked:true
    }
  },
  methods: {
  },
}
</script>
<style lang="scss" scoped>
.inquiry_server {
  background: #f7f8fa;
  height: 100vh;
  overflow: hidden;
}
.nav_bar {
  background: #f7f8fa;
  .text {
    color: #535568;
  }
}
.clinical_reception_func {
  margin-top: 0.44rem;
  background: #fff;
  display: flex;
  flex-direction: row;
  .diagnosis_box {
    height: 0.88rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .diagnosis_main_left {
      margin-left: .2rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .diagnosis_text {
        width: 0.62rem;
        height: 0.24rem;
        font-size: 0.15rem;
        font-family: PingFang-SC-Medium, PingFang-SC;
        font-weight: 500;
        color: #535568;
        line-height: 0.24rem;
      }
      p {
        display: inline-block;
        width: 2.24rem;
        height: .22rem;
        font-size: .12rem;
        font-family: PingFang-SC-Regular, PingFang-SC;
        font-weight: 400;
        color: #9fa4ae;
        line-height: .24rem;
      }
    }
    .diagnosis_main_right{
      margin-left: .7rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
