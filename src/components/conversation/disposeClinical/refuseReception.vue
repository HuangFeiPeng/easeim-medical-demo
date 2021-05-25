<template>
  <!-- 退诊页面 -->
  <div class="refuseReception">
    <van-nav-bar class="nav_bar">
      <template #title>
        <p class="text">选择退诊原因</p>
      </template>
      <template #left>
        <van-icon
          @click="$router.go(-1)"
          name="arrow-left"
          size="25"
          color="#333"
        />
      </template>
      <template #right>
        <p class="submit" @click="submit_data">提交</p>
      </template>
    </van-nav-bar>
    <div class="content">
      <ul>
        <li>
          <span>咨询不对症</span>
          <div
            class="pick_circle"
            @click.stop="exit_reason.consult = !exit_reason.consult"
          >
            <span class="pick_circle_empty" v-show="exit_reason.consult"></span
            ><img
              v-show="!exit_reason.consult"
              src="../../../assets/imgs/形状@2x.png"
            />
          </div>
        </li>
        <li class="van-hairline--top-bottom">
          <span>患者缺少诊疗资料</span>
          <div
            class="pick_circle"
            @click.stop="exit_reason.not_data = !exit_reason.not_data"
          >
            <span class="pick_circle_empty" v-show="exit_reason.not_data"></span
            ><img
              v-show="!exit_reason.not_data"
              src="../../../assets/imgs/形状@2x.png"
            />
          </div>
        </li>
        <li class="van-hairline--bottom">
          <span>患者病情复杂</span>
          <div
            class="pick_circle"
            @click.stop="exit_reason.complex = !exit_reason.complex"
          >
            <span class="pick_circle_empty" v-show="exit_reason.complex"></span
            ><img
              v-show="!exit_reason.complex"
              src="../../../assets/imgs/形状@2x.png"
            />
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
export default {
  data() {
    return {
      exit_reason: {
        consult: true,
        not_data: true,
        complex: true,
      },
    }
  },
  methods: {
    ...mapMutations(['changeDiagnoseState']),
    async submit_data() {
      if (
        this.exit_reason.consult &&
        this.exit_reason.not_data &&
        this.exit_reason.complex
      ) {
        this.$Toast({
          message: '请选择原因',
          icon: 'warning',
        })
      } else {
        let name = this.$route.query.name
        await this.changeDiagnoseState({ name: name, stateNum: 3 })
        this.$Toast({
          message: '提交成功',
          icon: 'warning',
        })
        setTimeout(() => {
          this.$router.go(-1)
        }, 800)
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.refuseReception {
  height: 100vh;
  overflow: hidden;
  .nav_bar {
    background: #f7f8fa;

    .text {
      color: #535568;
      font-size: 0.17rem;
      font-weight: 500;
    }
    .submit {
      font-size: 0.14rem;
      font-weight: 400;
      color: #25b4a5;
      line-height: 0.2rem;
      &:active {
        color: #535568;
      }
    }
  }
  .content {
    display: flex;
    flex-direction: column;
    margin-top: 0.08rem;
    background: #fff;
    font-size: 0.15rem;
    font-weight: 500;
    color: #4c4c4c;
    ul > li {
      display: flex;
      flex-direction: row;
      padding: 0 0.18rem;
      justify-content: space-between;
      align-items: center;
      height: 0.48rem;
      .pick_circle {
        width: 0.16rem;
        height: 0.16rem;
        padding: 0.1rem;
        // background: #000;
        .pick_circle_empty {
          display: inline-block;
          width: 100%;
          height: 100%;
          border: 1px solid #979797;
          border-radius: 50%;
        }
        img {
          width: 0.16rem;
          height: 0.16rem;
        }
      }
    }
  }
}
</style>
