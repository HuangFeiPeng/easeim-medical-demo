<template>
  <div class="input_box">
    <div class="input_func">
      <input
        class="input"
        cursor-spacing="65"
        confirm-type="done"
        ref="input"
        v-model.trim="inputValue"
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
          @click="sendMessage"
          src="@/assets/imgs/about_input/发送.png"
          alt=""
        />
      </div>
    </div>
    <div class="input_entend">
      <Emoji v-if="isShowEmoji" @addEmojiToInput="addEmoji" />
      <MoreFunc v-show="isShowPlusBox">
        <Audio />
        <Img @sendImg="sendImageMessage" />
        <File @sendFile="sendFileMessage" />
      </MoreFunc>
      <CollectAudio
        @sendAudioData="sendAudioMessage"
        v-show="isShowCollectBox"
      />
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import errCode from "@/utils/errorSatus";
import Emoji from "./suit/emoji";
import MoreFunc from "./suit/moreFunc";
import Audio from "./suit/about_audio/audio";
import CollectAudio from "./suit/about_audio/collect_audio";
import Img from "./suit/image";
import File from "./suit/file";

export default {
  props: {
    hx_id: {
      type: String,
      required: true //该参数为必填项
    }
  },
  data() {
    return {
      count: 0,
      inputValue: "",
      isShowEmoji: false, //表情框显隐
      isShowPlusBox: false, //扩展功能显隐
      isShowCollectBox: false //控制显示录音采集框
    };
  },
  mounted() {
    console.log(">>>>>>输入框部分");
  },
  methods: {
    ...mapActions([
      "onSendTextMessage",
      "onSendAudioMessage",
      "onSendImageMessage",
      "onSendFileMessage"
    ]),
    //文本消息
    async sendMessage() {
      try {
        const msgData = this.inputValue;
        const hxId = this.hx_id;
        if (this.inputValue === "") return this.$Toast.warn("不可发送空内容");
        await this.onSendTextMessage({ msgData, hxId });
        this.inputValue = "";
      } catch (error) {
        errCode(error);
      }
    },
    //语音消息
    async sendAudioMessage(recordData) {
      try {
        recordData.hxId = this.hx_id;
        let file = {
          url: this.$WebIM.utils.parseDownloadResponse(recordData.src),
          filename: "录音",
          filetype: ".amr",
          data: recordData.src
        };
        recordData.file = file;
        await this.onSendAudioMessage(recordData);
        this.$Toast.success("发送成功！");
      } catch (error) {
        errCode(error);
      }
    },
    //图片消息
    async sendImageMessage(el) {
      console.log(">>>>>图片的el", el);
      try {
        let hxId = this.hx_id;
        await this.onSendImageMessage({ el, hxId });
        this.$Toast.success("发送成功！");
      } catch (error) {
        errCode(error);
      }
    },
    //文件消息
    async sendFileMessage(el) {
      console.log(el);
      try {
        let hxId = this.hx_id;
        await this.onSendFileMessage({ hxId, el });
        this.$Toast.success("文件发送成功！");
      } catch (error) {
        errCode(error);
      }
    },
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
  .input_entend {
    user-select: none;
    position: relative;
  }
}
</style>
