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
    <!-- 问诊设置部分 -->
    <div class="clinical_reception_func" v-if="isShowInquiryPrice">
      <div class="diagnosis_box">
        <div class="diagnosis_main_left">
          <span class="diagnosis_text">接诊开关</span>
          <p>已开启，患者可向您发起问诊</p>
        </div>
        <div class="diagnosis_main_right">
          <van-switch
            v-model="checked"
            size="24"
            active-color="#25B4A5"
            inactive-color="#dcdee0"
          />
        </div>
      </div>
      <div class="setDiagnosis_price">
        <p class="text">问诊价格</p>
        <div class="setDiagnosis_btn">
          <b>{{ `¥${inquiryPrice}` }}</b>
          <van-icon
            class="icon_arrow"
            name="arrow"
            size="20"
            @click.stop="isShowInquiryPrice = false"
          />
        </div>
      </div>
    </div>
    <!-- 设置问诊价格部分 -->
    <div class="inquiryPrice_func" v-else>
      <div class="pickPrice">
        <p class="title">请选择咨询单价(元)</p>
        <div class="price_box">
          <ul>
            <li
              :class="{ active: idx === isActive }"
              v-for="(item, idx) in allPrice"
              :key="idx"
              @click=";(inquiry_Price = item), changeValue(idx)"
            >
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
      <div class="customPrice">
        <p class="title">自定义咨询单价</p>
        <input class="num_input" type="number" v-model="inquiry_Price" />
      </div>
      <div class="save_btn">
        <van-button class="btn" color="linear-gradient(169deg, #07C193 0%, #3EAAB4 100%)" @click.stop="isShowInquiryPrice = true,$store.commit('setCustomPrice',{price:inquiry_Price}) ">
          保存
        </van-button>
      </div>
    </div>
  </div>
</template>
<script>
import Storage from '@/utils/Storage' //TO DO 引入storage是为了将问诊按钮状态存储在本地，暂时还未实现。
import { mapState,mapMutations } from 'vuex';
export default {
  data() {
    return {
      title: '问诊服务设置',
      isShowInquiryPrice: true,
      inquiry_Price: '',
      checked: false,
      allPrice: [
        '0.00',
        '9.00',
        '19.00',
        '29.00',
        '39.00',
        '59.00',
        '99.00',
        '145.00',
      ],
      isActive: false,
    }
  },
  computed: {
    ...mapState({
      inquiryPrice: state => state.Setting.customPrice
    })
  },
  methods: {
    ...mapMutations(['setCustomPrice']),
    changeValue(index) {
      return (this.isActive = index)
    },
    savePrice(){
      console.log(11111);
      
      // this.setCustomPrice(this.inquiry_Price);
    }
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
.clinical_reception_func,
.inquiryPrice_func {
  margin-top: 0.44rem;
}
.clinical_reception_func {
  display: flex;
  flex-direction: column;
  .diagnosis_box {
    height: 0.88rem;
    display: flex;
    background: #fff;
    flex-direction: row;
    justify-content: space-between;
    .diagnosis_main_left {
      margin-left: 0.2rem;
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
        height: 0.22rem;
        font-size: 0.12rem;
        font-family: PingFang-SC-Regular, PingFang-SC;
        font-weight: 400;
        color: #9fa4ae;
        line-height: 0.24rem;
      }
    }
    .diagnosis_main_right {
      display: flex;
      justify-content: center;
      align-items: center;
      width: .9rem;
    }
  }
  .setDiagnosis_price {
    margin-top: 0.08rem;
    height: 0.48rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    padding-right: 0.16rem;
    font-size: 0.15rem;
    font-weight: 500;
    font-family: PingFang-SC-Medium, PingFang-SC;
    .text {
      display: inline-block;
      margin-left: 0.2rem;
      width: 0.62rem;
      height: 0.24rem;
      color: #535568;
      line-height: 0.24rem;
    }
    .setDiagnosis_btn {
      display: inline-flex;
      align-items: center;
      b {
        display: inline-block;
        width: 0.51rem;
        height: 0.24rem;
        color: #f78100;
        line-height: 24px;
      }
    }
  }
}
.inquiryPrice_func {
  display: flex;
  flex-direction: column;
  .pickPrice {
    max-height: 1.41rem;
    background: #fff;
    font-size: 0.15rem;
    padding: 0.15rem 0.15rem 0.21rem 0.2rem;
    .title {
      color: #535568;
    }
    .price_box {
      ul {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        margin-top: 0.1rem;
        li {
          display: inline-block;
          width: 0.72rem;
          height: 0.28rem;
          background: #9fa4ae;
          border-radius: 0.14rem;
          opacity: 0.15;
          border: 1px solid #9fa4ae;
          text-align: center;
          line-height: 0.28rem;
          margin-top: 0.12rem;
        }
        .active {
          color: #fff;
          background: #25b4a5;
          border-radius: 0.14rem;
          border: 1px solid #25b4a5;
          opacity: 1;
        }
      }
    }
  }
  .customPrice {
    background: #fff;
    margin-top: 0.08rem;
    max-height: 0.8rem;
    display: flex;
    flex-direction: column;
    .title {
      margin-top: .15rem;
      width: 1.14rem;
      height: 0.24rem;
      font-size: 0.16rem;
      font-family: PingFang-SC-Medium, PingFang-SC;
      font-weight: 500;
      color: #535568;
      line-height: 24px;
      margin-left: 0.2rem;
    }
    .num_input {
      padding:  0 0.2rem;
      height: 0.5rem;
      background: none;
      border: none;
      font-size: 0.15rem;
    }
  }
  .save_btn{
    margin-top: .54rem;
    height: .42rem;
    display: flex;
    align-items: center;
    justify-content: center;
    .btn{
      width: 3.37rem;
    }
  }
}
</style>
