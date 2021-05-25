<template>
  <div class="input_box">
    <div class="input_func">
      <input
        class="input"
        rows="1"
        cursor-spacing="65"
        confirm-type="done"
        ref="input"
        v-model="inputValue"
        maxlength="100"
      />
      <!-- 功能按钮 -->
      <div class="iconBox">
        <img
          v-show="isShowEmoji"
          @click="(isShowEmoji = !isShowEmoji), (isShowPlusBox = false)"
          class="keyIcon"
          src="@/assets/imgs/about_input/键盘.png"
          alt=""
        />
        <img
          v-show="!isShowEmoji"
          class="emoji_img"
          src="@/assets/imgs/about_input/emoji.png"
          alt=""
          @click="
            (isShowEmoji = !isShowEmoji),
              (isShowPlusBox = false),
              (isShowCollectBox = false)
          "
        />
        <img
          @click="
            (isShowPlusBox = !isShowPlusBox),
              (isShowEmoji = false),
              (isShowCollectBox = false)
          "
          v-show="inputValue === ''"
          class="plus_func"
          src="@/assets/imgs/about_input/添加附件@2x.png"
          alt=""
        />
        <img
          v-show="inputValue !== ''"
          class="sendBtn"
          src="@/assets/imgs/about_input/发送.png"
          alt=""
        />
      </div>
    </div>
    <div class="inout_entend">
      <Emoji v-if="isShowEmoji" @addEmojiToInput="addEmoji" />
      <MoreFunc v-show="isShowPlusBox">
        <Audio />
        <Img />
        <File />
      </MoreFunc>
      <CollectAudio v-show="isShowCollectBox" />
    </div>
  </div>
</template>
<script>
import Emoji from "./suit/emoji";
import MoreFunc from "./suit/moreFunc";
import Audio from "./suit/about_audio/audio";
import CollectAudio from "./suit/about_audio/collect_audio";
import Img from "./suit/image";
import File from "./suit/file";

export default {
  data() {
    return {
      count: 0,
      inputValue: "",
      // inputType: false, //控制input的类型
      isShowEmoji: false,
      isShowPlusBox: false,
      isShowCollectBox: false //控制显示录音采集框
    };
  },
  mounted() {},
  methods: {
    addEmoji(data) {
      this.inputValue += data;
    },
    showCollectBox() {
      this.isShowPlusBox = false;
      this.isShowCollectBox = true;
    },
    //初始化所有的输入框的显示状态
    initInputStatus() {
      (this.isShowEmoji = false),
        (this.isShowPlusBox = false),
        (this.isShowCollectBox = false);
    }
  },
  components: {
    Emoji,
    MoreFunc,
    Audio,
    Img,
    File,
    CollectAudio
  }
};
</script>
<style lang="scss" scoped>
.input_plus,
.input_box {
  position: fixed;
  left: 0;
  bottom: 0;
}
.input_box {
  display: flex;
  flex-direction: column;
  font-size: 0.14rem;
  width: 100%;
  background: #f7f8fa;

  .input_func {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 0.6rem;
    box-shadow: 0 0 0.08rem gray;
    .input {
      border: none;
      border-radius: 0.1rem;
      width: 2.77rem;
      max-height: 1.12rem;
      height: 0.32rem;
      line-height: 0.32rem;
      margin-left: 0.2rem;
    }
    .iconBox {
      width: 0.7rem;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-around;
      .keyIcon,
      .emoji_img,
      .sendBtn {
        margin-top: 0.02rem;
        width: 0.26rem;
        height: 0.26rem;
      }
      .plus_func {
        width: 0.22rem;
        height: 0.22rem;
      }
    }
    .microphone {
      width: 0.16rem;
      height: 0.22rem;
      margin-right: 0.09rem;
    }
  }
  .inout_entend {
    user-select: none;
    position: relative;
  }
}
</style>
