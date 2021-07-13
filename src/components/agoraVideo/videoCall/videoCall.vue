<template>
  <div class="videoCall_box">
    <!-- 本人视频画面显示容器 -->
    <div id="my_video" :style="isMinSize ? minSizeVideo : ''"></div>
    <!-- 他人视频显示容器 -->
    <div id="you_video"></div>

    <div class="call_page">
      <div class="call_page_title">
        <!--         <p class="called_name">{{ name }}</p> -->
        <p class="called_info" v-if="avStatus === 0">
          拨打中...
        </p>
        <p class="called_info" v-if="avStatus === 1 || avStatus === 2">
          等待张三接听中...
        </p>
        <p class="called_info" v-if="avStatus === 7">通话中...</p>
        <p class="called_info" v-if="avStatus === 3">
          某某某正在邀请您进行视频通话...
        </p>
      </div>
      <div class="call_page_tips" v-if="avStatus !== 7">
        <div>
          <h4>温馨提示：</h4>
          <p>
            1 通话过程会自动录音，通话结束后会自动发送在聊天区； 2
            通话接通后开始计时，15分钟后将自动持断，请珍惜问诊时间；
          </p>
        </div>
      </div>
    </div>
    <!-- 操作按钮 -->
    <div class="handle_btn">
      <!-- 主叫界面按钮 -->
      <div
        class="invite_btn"
        v-if="avStatus == 1 || avStatus == 2"
        @click="huangUp"
      >
        <img src="@/assets/imgs/挂断@2x.png" alt="" />
        <p>取消呼叫</p>
      </div>
      <!-- 被叫页面按钮 -->
      <div class="called_btn" v-if="avStatus === 3">
        <div>
          <img
            src="@/assets/imgs/接听@2x.png"
            alt=""
            @click="answerCall(), join(1)"
          />
          <p>接听</p>
        </div>
        <div>
          <img src="@/assets/imgs/挂断@2x.png" @click="huangUp" alt="" />
          <p>挂断</p>
        </div>
      </div>
      <!-- 接听界面按钮 -->
      <div class="answer_btn" v-if="avStatus === 7">
        <span>{{ length | filterRecordVoicTime }}</span>
        <img src="@/assets/imgs/挂断@2x.png" alt="" @click="huangUp" />
        <p>结束通话</p>
      </div>
    </div>
  </div>
</template>
<script>
import "./videoCall.scss";
import { mapActions, mapState } from "vuex";
import errCode from "@/utils/errorSatus";
export default {
  data() {
    return {
      timer: null,
      length: 0,
      isMinSize: false,
      minSizeVideo: {
        width: "1rem",
        height: "1.5rem",
        position: "absolute",
        right: "0",
        top: "0",
        "z-index": "99"
      }
    };
  },
  async beforeCreate() {
    const client = await this.$RTC.createClient({
      mode: "rtc",
      codec: "vp8"
    });
    await this.$store.dispatch("setRtcClient", { client });
    await this.rtcListener();
  },

  mounted() {
    const { caller } = this.$route.params;
    //含有caller 说明主叫进入了 不含则是被叫进入的
    if (caller) {
      this.join(0);
    } else {
      console.log(">>>>>>>>>>>>被叫进入");
      //被叫进入则修改状态为确定中...
      this.$store.commit("updataAvStatus", 3);
    }
    this.$Bus.$on("busy", () => {
      this.huangUp();
    });
    this.$Bus.$on("startTimer", () => {
      console.log(">>>>>>>>定时器开");
      this.startTimer();
    });
    this.$Bus.$on("normalHangUp", type => {
      this.huangUp(type);
    });
  },
  computed: {
    ...mapState({
      avStatus: state => state.Agroa.avStatus,
      rtc: state => state.Agroa.rtc
    })
  },
  filters: {
    filterRecordVoicTime(len) {
      let min = Math.floor(len / 60),
        sec = len % 60;
      let hou = Math.floor(min / 60);
      return (
        hou +
        ":" +
        (min < 10 ? "0" + min : min || min < 60 ? "0" + (min % 60) : min) +
        ":" +
        (sec < 10 ? "0" + sec : sec)
      );
    }
  },
  methods: {
    ...mapActions([
      "getRtctoken",
      "setLocalTrack",
      "onHuangUp",
      "answerCalle",
      "sendInviteMessage"
    ]),
    rtcListener() {
      this.rtc.client.on("user-published", async (user, mediaType) => {
        console.log("+++++++++++监听到远端推流", user, mediaType);
        // 开始订阅远端用户。
        await this.rtc.client.subscribe(user, mediaType);
        console.log(">>>>>>>>>+++++++this", this);
        this.isMinSize = true;
        // 如果订阅的是音频轨道
        if (mediaType === "audio") {
          const audioTrack = user.audioTrack;
          // 自动播放音频
          audioTrack.play();
        } else {
          const videoTrack = user.videoTrack;
          // 自动播放视频
          videoTrack.play("you_video");
        }
      });
    },
    async join(ident) {
      const appId = "15cb0d28b87b425ea613fc46f7c9f974";
      const username = this.$conn.user;
      const randomRoom = Math.random() * 10;
      const channelName = `${
        this.$conn.context.jid.clientResource
      }_${randomRoom}`;
      const appkey = this.$conn.context.appKey;
      const { HxId } = this.$route.params;
      const avType = 1;
      // 获取声网token

      if (ident === 0) {
        let { accessToken } = await this.getRtctoken({
          username,
          channelName,
          appkey
        });
        console.log(">>>>>>>>主叫进行加入房间");
        await this.$store.commit("updataChannelName", channelName);
        //加入房间
        try {
          const uid = await this.rtc.client.join(
            appId,
            channelName,
            accessToken,
            username
          );

          // 同时采集摄像头和麦克风
          const [
            localAudioTrack,
            localVideoTrack
          ] = await this.$RTC.createMicrophoneAndCameraTracks();
          await this.setLocalTrack({ localAudioTrack, localVideoTrack });
          // 或者批量取消发布
          await this.rtc.client.publish([localAudioTrack, localVideoTrack]);
          this.rtc.localVideoTrack.play("my_video");
          //发布邀请对方加入房间信息
          await this.sendInviteMessage({ HxId, avType });
        } catch (error) {
          console.log(">>>>>>>房间加入异常", error, errCode);
          errCode({ type: error.code });
          this.$router.go(-1);
        }
      }
      if (ident === 1) {
        console.log(">>>>>>>>>>>>>被邀请方加入成功");
        //   console.log(">>>>>>>accessToken>>>>>>", accessToken);
        //   //拿到邀请方发给的ID 然后调用加入。
        //   console.log(">>>>>>>被叫加入房间");
        const channelName = this.$store.state.Agroa.channelName;
        let { accessToken } = await this.getRtctoken({
          username,
          channelName,
          appkey
        });
        try {
          const uid = await this.rtc.client.join(
            appId,
            channelName,
            accessToken,
            username
          );
          // 同时采集摄像头和麦克风
          const [
            localAudioTrack,
            localVideoTrack
          ] = await this.$RTC.createMicrophoneAndCameraTracks();
          await this.setLocalTrack({ localAudioTrack, localVideoTrack });
          await this.rtc.client.publish([localAudioTrack, localVideoTrack]);
          this.rtc.localVideoTrack.play("my_video");
        } catch (error) {
          errCode({ type: error.code });
          this.$router.go(-1);
        }
      }
    },
    async answerCall() {
      console.log(">>>>>>>>确认接听");
      const { HxId } = this.$route.params;
      await this.startTimer();
      await this.answerCalle({ toId: HxId });
    },
    async huangUp(type) {
      const { HxId } = this.$route.params;
      if (type === "calledHangUp") {
        // 销毁本地音视频轨道。
        // this.rtc.localAudioTrack && this.rtc.localAudioTrack.close();
        // await this.rtc.client.leave();
        await this.$store.commit("initLocalChannel");
        await this.$store.commit("initRtcStatus");
        await this.$router.back(-1);
        return;
      } else {
        if (this.avStatus === 1) {
          await this.onHuangUp({ type: 0 });
        }
        if (this.avStatus === 2) {
          await this.onHuangUp({ type: 1, HxId });
        }
        if (this.avStatus === 3) {
          await this.onHuangUp({ type: 2, HxId });
        }
        if (this.avStatus === 7) {
          await this.onHuangUp({ type: 3, HxId });
        }
        // 销毁本地音视频轨道。
        // this.rtc.localAudioTrack && this.rtc.localAudioTrack.close();
        // this.rtc.localVideoTrack && this.rtc.localVideoTrack.close();
        // await this.rtc.client.leave();
        await this.$store.commit("initLocalChannel");
        await this.$router.go(-1);
        return;
      }
    },
    startTimer() {
      this.timer = setInterval(() => {
        this.length++;
      }, 1000);
    }
  }
};
</script>
