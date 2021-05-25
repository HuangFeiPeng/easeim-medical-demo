<template>
  <div>
    <div class="collect_box">
      <h3 class="recordTitle" v-text="recordType[voice.type]"></h3>
      <div class="recordTime">
        {{ voice.length | filterRecordVoicTime }}
      </div>
      <div
        class="collect_btn"
        ref="btn"
        @touchstart.prevent="startRecord"
        @touchmove="recording"
        @touchend.stop="recordOver"
      >
        <img
          v-if="voice.type === 0"
          src="@/assets/imgs/about_input/maike.png"
          alt=""
        />
        <!-- 录制中的div样式 -->
        <div v-if="voice.type === 1" class="reacordingStyle"></div>
      </div>
    </div>
  </div>
</template>
<script>
import BenzAMRRecorder from "benz-amr-recorder";
export default {
  data() {
    return {
      type: 0, // 0未录音 1录音中 2录音完毕
      recordType: {
        0: "按住说话",
        1: "上滑取消"
      },
      voice: {
        interval: null, // 录音定时器
        type: 0, // 0未录音 1录音中 2录音完毕 3回放录音
        length: 0, // 录音长度
        src: null // 录音资源
      },
      amrRec: null, //录音对象
      changedTouches: null
    };
  },
  filters: {
    filterRecordVoicTime(len) {
      let min = Math.floor(len / 60),
        sec = len % 60;
      ("1:30");
      return min + ":" + (sec < 10 ? "0" + sec : sec);
    }
  },
  methods: {
    /*
     * 按下的时候开始计时，并且还是采集录音
     */
    startRecord(e) {
      this.changedTouches = e.changedTouches[0]; //获取touch初始位置
      if (this.voice.type === 0) {
        this.amrRec = new BenzAMRRecorder();
        this.amrRec
          .initWithRecord()
          .then(() => {
            this.amrRec.startRecord(); //开始录音
            this.voice.type = 1;
            //开启录音时长定时器
            this.voice.interval = setInterval(() => {
              this.voice.length++;
            }, 1000);
          })
          .catch(e => {
            this.voice.type = 0;
            this.$Toast("录音失败，请检查相关权限和设备");
          });
      }
    },
    /*
     *移动的时候提示上滑滑出按钮取消录音，滑动回来录音正常
     */
    recording(e) {
      if (
        this.changedTouches.pageY - e.touches[0].pageY > 60 &&
        this.voice.type !== 0
      ) {
        //开始的坐标减去 移动的最后的坐标如果大于20，<20是一个旷量防止用户误触> 则是向上移动
        this.amrRec.cancelRecord();
        clearInterval(this.voice.interval);
        this.initVocie();
        this.$Toast.success("取消录音");
        return;
      }
      if (this.changedTouches.pageY - e.touches[0].pageY > 20) {
        console.log(">>>>正常");
      }
    },
    /*
     *抬起的时候录音暂停且发送出去。
     */
    recordOver() {
      this.amrRec
        .finishRecord()
        .then(() => {
          clearInterval(this.voice.interval);
          if (this.voice.length <= 1) {
            this.initVocie();
            // 放弃录音
            this.amrRec.cancelRecord();
            this.$Toast({
              type: "warning",
              message: "录音时间较短"
            });
          } else {
            this.voice.length = Math.ceil(this.amrRec.getDuration());
            // 获取音频文件
            this.voice.src = this.amrRec.getBlob();
            clearInterval(this.voice.interval);
            this.initVocie();
            console.log(">>>>>>>>src", this.voice.src);
          }
        })
        .catch(() => {
          this.$Toast("录音失败，请检查相关权限");
        });
    },
    initVocie() {
      this.voice.interval = null;
      this.voice.length = 0;
      this.voice.type = 0;
    }
  }
};
</script>
<style lang="scss" scoped>
@import url("./collect_audio.scss");
</style>
