<template>
  <div class="chat_content">
    <div class="msglist_box" @click="initAllInputStatus" ref="scroll">
      <div class="scroll-content">
        <div
          class="scroll-item"
          v-for="(item, index) in count"
          :key="index"
          @selectstart="false"
        >
          {{ item }}
        </div>
      </div>
    </div>
    <InputBox ref="input_box" />
  </div>
</template>
<script>
import "./chat_content.scss";
import InputBox from "../input_box/input_box";
import BScroll from "@better-scroll/core";
export default {
  data() {
    return {
      count: 50,
      isLoading: false
    };
  },
  watch: {
    count() {
      console.log(">>>>>监听到发生变化");
    }
  },
  created() {
    console.log(">>>>>>>created执行");
  },
  mounted() {
    this.$nextTick(() => {
      this.initScroll();
    });
  },
  beforeDestroy() {
    //组件销毁释放
    this.bs.destroy();
  },
  methods: {
    initScroll() {
      this.bs = new BScroll(this.$refs["scroll"], {
        probeType: 3,
        click: true
      });
      this.bs.scrollTo(0, -12000, 0);
      this.bs.on("scrollStart", () => {
        console.log("scrollStart-");
      });
      this.bs.on("scroll", ({ y }) => {
        console.log("scrolling-");
      });
      this.bs.on("scrollEnd", pos => {
        console.log(pos);
      });
    },
    initAllInputStatus() {
      // console.log(">>>>>>", this.$refs["input_box"]);
      this.$refs["input_box"].initInputStatus();
      console.log(">>>>>触发子组件的初始化input状态");
    }
  },
  components: {
    InputBox
  }
};
</script>
