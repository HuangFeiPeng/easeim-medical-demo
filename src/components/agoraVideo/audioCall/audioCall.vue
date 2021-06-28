<template>
  <div class="audioCall_box">
    <!-- 主动呼叫 -->
    <div class="call_page">
      <div class="avtior">
        <img src="@/assets/imgs/占位01.jpeg" alt="" />
      </div>
      <div class="call_page_title">
        <p class="called_name">{{ name }}</p>
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
      <!-- <p class="call_duration">00:00</p> -->
    </div>
    <!-- 操作按钮 -->
    <div class="handle_btn">
      <!-- 主交界面按钮 -->
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
          <img src="@/assets/imgs/接听@2x.png" alt="" />
          <p>接听</p>
        </div>
        <div @click="huangUp">
          <img src="@/assets/imgs/挂断@2x.png" alt="" />
          <p>挂断</p>
        </div>
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
      name: this.$route.params.name
    };
  },
  async created() {
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
      this.join();
    } else {
      console.log(">>>>>>>>>>>>被叫进入");
      //被叫进入则修改状态为确定中...
      this.$store.commit("updataAvStatus", 3);
    }

    this.$Bus.$on("busy", () => {
      this.huangUp();
    });
  },
  computed: {
    ...mapState({
      avStatus: state => state.Agroa.avStatus,
      rtc: state => state.Agroa.rtc
    })
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
      "setLocalAudioTrack",
      "onHuangUp"
    ]),
    rtcListener() {
      console.log(">>>>>>>>>>rtcListener");
      // this.rtc.client.on("user-published", async (user, mediaType) => {
      //   // 开始订阅远端用户。
      //   await this.rtc.client.subscribe(user, mediaType);
      //   console.log("subscribe success");
      //   // 表示本次订阅的是视频。
      //   if (mediaType === "video") {
      //     // 订阅完成后，从 `user` 中获取远端视频轨道对象。
      //     const remoteVideoTrack = user.videoTrack;
      //     // 动态插入一个 DIV 节点作为播放远端视频轨道的容器。
      //     const playerContainer = document.createElement("div");
      //     // 给这个 DIV 节点指定一个 ID，这里指定的是远端用户的 UID。
      //     playerContainer.id = user.uid.toString();
      //     playerContainer.style.width = "640px";
      //     playerContainer.style.height = "480px";
      //     document.body.append(playerContainer);
      //     // 订阅完成，播放远端音视频。
      //     // 传入 DIV 节点，让 SDK 在这个节点下创建相应的播放器播放远端视频。
      //     remoteVideoTrack.play(playerContainer);
      //     // 也可以只传入该 DIV 节点的 ID。
      //     // remoteVideoTrack.play(playerContainer.id);
      //   }
      //   // 表示本次订阅的是音频。
      //   if (mediaType === "audio") {
      //     // 订阅完成后，从 `user` 中获取远端音频轨道对象。
      //     const remoteAudioTrack = user.audioTrack;
      //     // 播放音频因为不会有画面，不需要提供 DOM 元素的信息。
      //     remoteAudioTrack.play();
      //   }
      // });
    },

    async join() {
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
      let { accessToken } = await this.getRtctoken({
        username,
        channelName,
        appkey
      });
      await this.$store.commit("updataChannelName", channelName);
      //加入房间
      const uid = await this.rtc.client.join(
        appId,
        channelName,
        accessToken,
        username
      );
      //发布邀请对方加入房间信息

      //发布本地音频轨道
      let localAudioTrack = await this.$RTC.createMicrophoneAudioTrack();
      await this.setLocalAudioTrack({ localAudioTrack });
      // this.rtc.localAudioTrack = await this.$RTC.createMicrophoneAudioTrack();
      await this.rtc.client.publish([this.rtc.localAudioTrack]);
      await this.sendInviteMessage({ HxId, avType });
    },
    async huangUp() {
      const { HxId } = this.$route.params;
      console.log(">>>>>挂断");
      if (this.avStatus === 1) {
        await this.onHuangUp({ type: 0 });
      }
      if (this.avStatus === 2) {
        await this.onHuangUp({ type: 1, HxId });
      }
      if (this.avStatus === 3) {
        // await this.onHuangUp({ type: 2, HxId });
      }
      await this.rtc.client.leave();
      // this.$router.push({ name: "Conversation" });
      await this.$router.back(-1);
    }
  }
};
</script>