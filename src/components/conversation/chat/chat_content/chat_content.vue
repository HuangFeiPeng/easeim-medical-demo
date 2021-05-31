<template>
  <div class="chat_content">
    <div class="msglist_box" @click="initAllInputStatus" ref="scroll">
      <div class="scroll-content">
        <div
          class="scroll-item"
          v-for="(item, index) in msgList[hxId]"
          :key="index"
          @selectstart="false"
        >
          {{ item.content }}
        </div>
      </div>
    </div>
    <InputBox ref="input_box" :hx_id="hxId" />
  </div>
</template>
<script>
import "./chat_content.scss";
import { mapState } from "vuex";
import InputBox from "../input_box/input_box";
import BScroll from "@better-scroll/core";
export default {
  data() {
    return {
      hxId: this.$route.query.HxId || "",
      isLoading: false,
      BS: null
    };
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
      // nowPanientDetil: state => state.Conversation.nowPanientDetil,
      // nowContactMsg: state => state.Message.nowContactMsg
      msgList: state => state.Message.msgList
    })
  },
  watch: {
    "$store.state.Message.msgList"() {
      console.log(">>>>>>>数据改变", this.BS);
      // this.BS.refresh(); //重新计算 BetterScroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常。
      // this.scrollTo();
      this.initScroll();
    }
  },
  methods: {
    initScroll() {
      this.$nextTick(() => {
        this.BS = new BScroll(this.$refs["scroll"], {
          click: true
        });
        this.scrollTo();
      });
    },
    //滚动的方法
    scrollTo() {
      this.$nextTick(() => {
        this.BS.scrollTo(0, this.BS.maxScrollY, 500);
      });
    },

    initAllInputStatus() {
      this.$refs["input_box"].initInputStatus();
    }
  },
  components: {
    InputBox
  }
};
</script>
