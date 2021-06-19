<template>
  <div class="chat_content">
    <div class="msglist_box" @click="initAllInputStatus" ref="scroll">
      <div class="msglist_content scroll-content">
        <div class="pulldown-wrapper">
          <div v-show="beforePullDown">
            <span>下拉加载更多消息</span>
          </div>
          <div v-show="!beforePullDown">
            <div v-show="isPullingDown">
              <span>Loading...</span>
            </div>
            <div v-show="!isPullingDown">
              <span>加载成功</span>
            </div>
          </div>
        </div>
        <!-- 每一条消息 -->
        <div
          class="msglist_content_item scroll-item"
          v-for="(item, index) in msgList[hxId]"
          :key="index"
        >
          <span class="time">{{ handleTime(item.time) || "" }}</span>
          <div
            :class="[
              'msg_body',
              { content_right: item.self },
              { content_left: !item.self }
            ]"
          >
            <!-- 头像 -->
            <img
              class="avatar"
              :src="item.self ? avatarUrl.doctor : avatarUrl.patient"
            />
            <div class="content">
              <!-- 文本消息 -->
              <p class="text" v-if="item.chatType === 'TEXT'">
                {{ item.content }}
              </p>
              <!-- 图片消息 -->
              <van-image
                :src="item.file && item.file.url"
                v-if="item.chatType === 'IMAGE'"
                @load="loadImgOk"
              >
                <template v-slot:loading>
                  <van-loading type="spinner" size="20" />
                </template>
              </van-image>
              <!-- 文件消息 -->
              <div class="file" v-if="item.chatType === 'FILE'">
                <img
                  class="file_img"
                  :src="fileType[item.file.filetype]"
                  alt=""
                />
                <div class="file_content">
                  <span class="title">{{ item.file.filename }}</span>
                  <span class="file_length">{{
                    renderSize(item.file.file_length)
                  }}</span>
                </div>
              </div>
              <!-- 音频消息 -->
              <div
                :class="[
                  'audio',
                  { my_audio: item.self },
                  { your_audio: !item.self }
                ]"
                v-if="item.chatType === 'VOICE'"
                @click.prevent.stop="
                  playAudio(item), (armSeting.isPlayIdx = index)
                "
              >
                <span class="dot" v-if="!item.isPlay"></span>
                <div
                  :class="[
                    'play_animation',

                    {
                      start_animation:
                        armSeting.isPlaying && armSeting.isPlayIdx === index
                    }
                  ]"
                ></div>
                <span class="length"
                  ><sub>{{ `${item.file.length}''` }}</sub></span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 输入框组件 -->
    <InputBox ref="input_box" :hx_id="hxId" />
  </div>
</template>
<script>
import "./chat_content.scss";
import { mapState, mapActions } from "vuex";
import InputBox from "../input_box/input_box";
import BScroll from "@better-scroll/core";
import PullDown from "@better-scroll/pull-down";
import { renderTime, renderSize } from "@/utils/renderTime";
import { fileType } from "@/utils/fileType";
import { findIndex } from "@better-scroll/shared-utils";
import BenzAMRRecorder from "benz-amr-recorder";

BScroll.use(PullDown);
const TIME_BOUNCE = 800;
const REQUEST_TIME = 1000;
const THRESHOLD = 70;
const STOP = 56;

export default {
  data() {
    return {
      hxId: this.$route.query.HxId || "",
      BS: null,
      avatarUrl: {
        doctor: require("@/assets/imgs/占位01.jpeg"),
        patient: require("@/assets/imgs/占位02.jpeg")
      },
      armSeting: {
        isPlaying: false,
        isPlayIdx: -1
      },
      beforePullDown: true,
      isPullingDown: false
    };
  },
  created() {
    this.renderTime = renderTime;
    this.fileType = fileType;
    this.renderSize = renderSize;
  },
  mounted() {
    this.initScroll();
  },
  beforeDestroy() {
    //scroll插件销毁释放
    this.BS.destroy();
  },
  computed: {
    ...mapState({
      msgList: state => state.Message.msgList
    })
  },
  watch: {
    "$store.state.Message.msgList"(oldVal, newVal) {
      console.log(">>>>>>>数据改变", oldVal, newVal);
      setTimeout(() => {
        this.BS.refresh();
        this.scrollTo();
      }, 500);
    }
  },
  methods: {
    ...mapActions(["onSetAudioMsgPlayStatus", "onGetHistoryMessage"]),
    //滚动插件
    initScroll() {
      this.$nextTick(() => {
        this.BS = new BScroll(this.$refs["scroll"], {
          click: true,
          scrollY: true,
          bounceTime: TIME_BOUNCE,
          useTransition: false,
          pullDownRefresh: {
            threshold: THRESHOLD,
            stop: STOP
          }
        });
        this.scrollTo();
        this.BS.on("pullingDown", this.pullingDownHandler);
      });
    },
    async pullingDownHandler() {
      console.log("trigger pullDown");
      this.beforePullDown = false;
      this.isPullingDown = true;
      await this.requestData();
      this.isPullingDown = false;
      this.finishPullDown();
    },
    async finishPullDown() {
      this.BS.finishPullDown();
      setTimeout(() => {
        this.beforePullDown = true;
        this.BS.refresh();
      }, TIME_BOUNCE + 100);
    },
    async requestData() {
      const hxId = this.hxId;
      try {
        let data = await this.onGetHistoryMessage(hxId);
        if (data && data.length === 0) {
          this.$Toast("暂无更过消息");
        }
      } catch (err) {
        console.log(">>>>>数据加载失败", err);
      }
    },
    //图片加载完毕置底
    loadImgOk() {
      console.log(">>>>>图片加载完毕");
      //图片加载完毕再调用一次滚动，解决图片加载完成之后滚动不完全置底问题。
      // this.initScroll();
      this.$nextTick(() => {
        this.BS.refresh();
        this.scrollTo();
      });
    },
    //播放音频
    playAudio(msg) {
      let _that = this;
      let src = msg.file.url;
      let isPlay = msg.isPlay;
      let armRec = new BenzAMRRecorder();
      !isPlay && this.setAudioMsgPlayStatus(msg);
      // this.setAudioMsgPlayStatus(msg);
      armRec.initWithUrl(src).then(function() {
        if (!_that.armSeting.isPlaying) {
          armRec.play();
        }
        return;
      });

      armRec.onPlay(function() {
        console.log("开始播放", _that);
        if (!_that.armSeting.isPlaying) {
          console.log(_that.armSeting.isPlaying);
          _that.armSeting.isPlaying = true;
        }
      });
      armRec.onStop(function() {
        console.log(">>>>>结束播放", (_that.armSeting.isPlaying = true));
        if (_that.armSeting.isPlaying === true) {
          _that.armSeting.isPlaying = false;
        }
      });
    },
    //处理音频消息红点
    setAudioMsgPlayStatus(msg) {
      console.log(">>>>>>处理音频消息红点执行");
      this.onSetAudioMsgPlayStatus(msg);
    },
    //滚动的方法
    scrollTo() {
      this.$nextTick(() => {
        console.log(">>>>>滚动置底被调用");
        this.BS.scrollTo(0, this.BS.maxScrollY, 500);
      });
    },
    //处理消息时间戳的显示
    handleTime(timestamp) {
      const nowMsgList = this.msgList[this.hxId];
      //拿到传入的数据时间戳所在对象的下标
      let _index =
        nowMsgList && nowMsgList.findIndex(item => item.time === timestamp);
      // 传入时间戳的下标与上一个时间戳做对比,大于50000显示其时间戳
      if (_index !== 0) {
        let lastMsgTime = Number(nowMsgList[_index - 1].time);
        let nowMsgTime = Number(nowMsgList[_index].time);
        if (nowMsgTime - lastMsgTime > 50000) {
          return this.renderTime(timestamp);
        } else {
          return false;
        }
      } else {
        return this.renderTime(timestamp);
      }
    },
    //初始化input框的各功能状态
    initAllInputStatus() {
      this.$refs["input_box"].initInputStatus();
    }
  },
  components: {
    InputBox
  }
};
</script>
