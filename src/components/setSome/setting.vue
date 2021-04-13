<template>
  <div class="setting">
    <van-nav-bar class="nav_bar" fixed>
      <template #title>
        <!-- <van-icon name="search" size="18" /> -->
        <p v-text="title" class="text"></p>
      </template>
    </van-nav-bar>
    <div class="setting_main_box">
      <div class="setting_main_header">
        <img src="../../assets/imgs/占位04.jpeg" alt="" />
        <span>王祖贤</span>
      </div>
      <div class="setting_main_func">
        <div class="setting_main_func_list" @click="$router.push('/inquiry_server')">
          <div>
            <img src="../../assets/imgs/icon／我的设置@2x.png" alt="" /><span
              >问诊服务设置</span
            >
          </div>
          <van-icon class="icon_arrow" name="arrow" />
        </div>
        <div class="setting_main_func_list" @click="$router.push('/general_server')">
          <div>
            <img src="../../assets/imgs/icon／设置@2x.png" alt="" /><span
              >通用设置</span
            >
          </div>
          <van-icon class="icon_arrow" name="arrow" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  name: 'Setting',
  data() {
    return {
      title: '个人设置',
    }
  },
  computed: {
   ...mapState({
     price:state=>{state.Setting.customPrice}
   })
  }
}
</script>
<style lang="scss" scoped>
.setting {
  background: #f7f8fa;
  height: 100vh;
  overflow: hidden;
  .nav_bar {
    background: #f7f8fa;
    .text {
      color: #535568;
    }
  }
  .setting_main_box {
    display: flex;
    flex-direction: column;
    height: 2rem;
    .setting_main_header {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-top: 0.46rem;
      height: 1.22rem;
      background: #fff;
      font-size: 0.21rem;
      color: #333;
      padding: 0.28rem 0 0.24rem 0.2rem;
      img {
        width: 0.6rem;
        height: 0.6rem;
      }
      span {
        display: inline-block;
        margin-left: 0.12rem;
      }
    }
    .setting_main_func {
      font-size: 0.15rem;
      .setting_main_func_list {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 0.48rem;
        background: #fff;
        margin: 0.08rem 0;
        line-height: 0.48rem;
        &:active{
          background: rgba(0, 0, 0, 0.247);
        }
        div {
          display: flex;
          align-items: center;
          img {
            width: 0.16rem;
            height: 0.16rem;
            margin: 0.16rem 0.04rem 0.16rem 0.19rem;
          }
        }

        .icon_arrow {
          margin-right: 0.16rem;
        }
      }
    }
  }
}
</style>
