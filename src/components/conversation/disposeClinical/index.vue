<template>
  <div class="disposeClinical">
    <van-nav-bar class="nav_bar" fixed>
      <template #title>
        <p class="text">{{ patientInfo.name || '患者昵称' }}</p>
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
    <div class="patient_content" ref="container">
      <!-- 吸顶通知条 -->
      <van-sticky :container="container" :offset-top="50">
        <van-notice-bar
          left-icon="volume-o"
          :text="
            navText[patientInfo.diagnoseState] &&
              navText[patientInfo.diagnoseState].text
          "
          :color="
            navText[patientInfo.diagnoseState] &&
              navText[patientInfo.diagnoseState].color
          "
          :background="
            navText[patientInfo.diagnoseState] &&
              navText[patientInfo.diagnoseState].background
          "
        />
      </van-sticky>
      <div class="patient_content_box">
        <time>17:30</time>
        <div class="main_box">
          <div class="person_info" v-if="patientInfo.detil">
            <h1 class="title">患者信息</h1>
            <p>
              <span>基本信息</span> {{ patientInfo.name || '患者名' }} |
              {{ patientInfo.detil.personal_details.sex ? '男' : '女' }} |
              {{ patientInfo.detil.personal_details.age + '岁' }} |
              {{ patientInfo.detil.personal_details.weight + 'kg' }}
            </p>
            <p>
              <span>肝肾功能</span
              >{{
                patientInfo.detil.personal_details.liver
                  ? '肝功能正常'
                  : '肝功能障碍'
              }}
              |
              {{
                patientInfo.detil.personal_details.kidney
                  ? '肾功能正常'
                  : '肾功能障碍'
              }}
            </p>
            <p>
              <span>孕育情况</span
              >{{ patientInfo.detil.personal_details.breed ? '怀了' : '无' }}
            </p>
            <p>
              <span>过敏史</span>{{ patientInfo.detil.personal_details.irr }}
            </p>
            <p>
              <span>过往病史</span>{{ patientInfo.detil.personal_details.all }}
            </p>
          </div>
          <div class="onepxLine van-hairline--bottom"></div>
          <div class="illness_details" v-if="patientInfo.detil">
            <h1 class="title">病情描述</h1>
            <p>
              <span>主诉：</span>{{ patientInfo.detil.illness_details.decs }}
            </p>
            <div class="illness_details_img">
              <ul>
                <li
                  v-for="(item, idx) in patientInfo.detil.illness_details
                    .decs_img"
                  :key="idx"
                >
                  <img :src="item" alt="" />
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!-- 功能按钮已退诊以及问诊结束不显示  -->
        <div class="changBtn" >
          <van-button style="color:#25B4A5; border:.02rem solid #25B4A5;" v-if="patientInfo.diagnoseState === 0">
            退诊
          </van-button>
          <van-button color="linear-gradient(169deg, #07C193 0%, #3EAAB4 100%)" v-if="patientInfo.diagnoseState === 0" @click="agreeReception">
            接诊
          </van-button>
          <van-button color="linear-gradient(169deg, #07C193 0%, #3EAAB4 100%)" v-if="patientInfo.diagnoseState === 1">
            继续问诊
          </van-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import './index.scss'
import { mapState,mapMutations } from 'vuex'
export default {
  data() {
    return {
      container: null,
      navText: {
        '0': {
          text: '等待接诊中，两小时内为接诊将自动退诊',
          background: '#E1F0F1',
          color: '#F7B500',
        },
        '1': { text: '接诊进行中...', background: '#E1F0F1', color: '#25B4A5' },
        '2': { text: '问诊结束...', background: '#E1F0F1', color: '#0074FA' },
        '3': { text: '已退诊...', background: '#E1F0F1', color: '#DC143C' },
      },
    }
  },

  computed: {
    ...mapState({
      patientInfo: (state) => state.Conversation.nowPanientDetil,
    }),
  },
  methods: {
    ...mapMutations(['changeDiagnoseState']),
    //接诊
    agreeReception(){
      let name = this.patientInfo.name;
      this.changeDiagnoseState({name:name,stateNum:1})
    },
    //退诊
    refuseReception(){

    }
  },
}
</script>
<style lang="scss" scoped>
// @import url('./index.scss');
</style>
