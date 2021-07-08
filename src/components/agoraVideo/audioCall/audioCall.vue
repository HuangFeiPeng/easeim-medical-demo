<template>
  <div class="audioCall_box">
    <!-- 主动呼叫 -->
    <div class="call_page">
      <div class="avtior">
        <img src="@/assets/imgs/占位01.jpeg" alt="" />
      </div>
      <div class="call_page_title">
        <p class="called_name">{{ name }}</p>
        <p class="called_info" v-if="avStatus === 0">
          拨打中...
        </p>
        <p class="called_info" v-if="avStatus === 1 || avStatus === 2">
          等待张三接听中...
        </p>
        <p class="called_info" v-if="avStatus === 7">通话中...</p>
        <p class="called_info" v-if="avStatus === 3">
          某某某正在邀请您进行语音通话...
        </p>
      </div>
      <div class="call_page_tips">
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
        <div @click="huangUp">
          <img src="@/assets/imgs/挂断@2x.png" alt="" />
          <p>挂断</p>
        </div>
      </div>
      <!-- 接听界面按钮 -->
      <div class="answer_btn" v-if="avStatus === 7">
        <span>{{ length | filterRecordVoicTime }}</span>
        <img src="@/assets/imgs/挂断@2x.png" alt="" @click="huangUp(1)" />
        <p>结束通话</p>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import "./audioCall.scss";
export default {
  data() {
    return {
      name: this.$route.params.name,
      timer: null,
      length: 0
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
  beforeDestroy() {
    clearInterval(this.timer);
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
  watch: {
    avStatus(newVal, oldVal) {
      console.log(">>>>>>>>", newVal, oldVal);
    }
  },
  methods: {
    ...mapActions([
      "getRtctoken",
      "sendInviteMessage",
      "setLocalTrack",
      "onHuangUp",
      "answerCalle"
    ]),
    rtcListener() {
      console.log(">>>>>>>>>>rtcListener");
      this.rtc.client.on("user-published", async (user, mediaType) => {
        // 开始订阅远端用户。
        await this.rtc.client.subscribe(user, mediaType);
        console.log("subscribe success");
        // 表示本次订阅的是视频。
        // if (mediaType === "video") {
        //   // 订阅完成后，从 `user` 中获取远端视频轨道对象。
        //   const remoteVideoTrack = user.videoTrack;
        //   // 动态插入一个 DIV 节点作为播放远端视频轨道的容器。
        //   const playerContainer = document.createElement("div");
        //   // 给这个 DIV 节点指定一个 ID，这里指定的是远端用户的 UID。
        //   playerContainer.id = user.uid.toString();
        //   playerContainer.style.width = "640px";
        //   playerContainer.style.height = "480px";
        //   document.body.append(playerContainer);
        //   // 订阅完成，播放远端音视频。
        //   // 传入 DIV 节点，让 SDK 在这个节点下创建相应的播放器播放远端视频。
        //   remoteVideoTrack.play(playerContainer);
        //   // 也可以只传入该 DIV 节点的 ID。
        //   // remoteVideoTrack.play(playerContainer.id);
        // }
        // 表示本次订阅的是音频。
        if (mediaType === "audio") {
          // 订阅完成后，从 `user` 中获取远端音频轨道对象。
          const remoteAudioTrack = user.audioTrack;
          // 播放音频因为不会有画面，不需要提供 DOM 元素的信息。
          remoteAudioTrack.play();
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
      const avType = 0;
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
          //发布邀请对方加入房间信息
          //发布本地音频轨道
          let localAudioTrack = await this.$RTC.createMicrophoneAudioTrack();
          await this.setLocalTrack({ localAudioTrack });
          await this.rtc.client.publish([this.rtc.localAudioTrack]);
          await this.sendInviteMessage({ HxId, avType });
        } catch (error) {
          console.log(">>>>>>>房间加入异常", error);
        }
      }
      if (ident === 1) {
        console.log(">>>>>>>accessToken>>>>>>", accessToken);
        //拿到邀请方发给的ID 然后调用加入。
        console.log(">>>>>>>被叫加入房间");
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
          let localAudioTrack = await this.$RTC.createMicrophoneAudioTrack();
          await this.setLocalAudioTrack({ localAudioTrack });
          await this.rtc.client.publish([this.rtc.localAudioTrack]);
        } catch (error) {
          console.log(">>>>>>>>房间加入异常", error);
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
        this.rtc.localAudioTrack && this.rtc.localAudioTrack.close();
        await this.rtc.client.leave();
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
        this.rtc.localAudioTrack && this.rtc.localAudioTrack.close();
        await this.rtc.client.leave();
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