<template>
  <div>
    <div class="file_box" @click="show = true">
      <img src="@/assets/imgs/about_input/音视频@2x.png" alt="" />
    </div>
    <van-action-sheet v-model="show" :actions="actions" @select="onSelect" />
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      show: false,
      actions: [
        { name: "音频呼叫", callType: "AUDIO" },
        { name: "视频呼叫", callType: "VIDEO" }
      ]
    };
  },
  computed: {
    ...mapState({
      nowPickPanient: state => state.Conversation.nowPanientDetil
    })
  },
  methods: {
    onSelect(item) {
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      console.log(">>>>>item", item);
      this.toCallPage(item.callType);
      this.show = false;
    },
    toCallPage(type) {
      const { HxId, name } = this.nowPickPanient;
      if (!this.$RTC.checkSystemRequirements()) {
        this.$Notify({
          type: "danger",
          message: "当前环境暂不支持音视频通话！"
        });
        return;
      }
      if (type === "AUDIO") {
        this.$router.push({
          name: "AudioCall",
          params: { HxId, name, caller: true }
        });
        return;
      }
      if (type === "VIDEO") {
        this.$router.push({ path: "/videoCall" });
        return;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.file_box {
  margin-left: 0.4rem;
  width: 0.49rem;
  height: 0.49rem;
  img {
    width: 0.49rem;
    height: 0.49rem;
  }
}
</style>
