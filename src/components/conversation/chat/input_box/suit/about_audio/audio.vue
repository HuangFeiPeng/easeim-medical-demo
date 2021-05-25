<template>
  <div>
    <div class="audio_box" @click="showCollectBox">
      <img src="@/assets/imgs/about_input/语音备份 2@2x.png" alt="" />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isShow: false,
    }
  },
  methods: {
    //显示录音采集框
    showCollectBox() {
      this.$parent.$parent.showCollectBox() //调用input里面的展示录音框的
    },
  },
}
</script>
<style lang="scss" scoped>
.audio_box {
  width: 0.49rem;
  height: 0.49rem;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.05rem;
}
.send_audio_box {
  position: absolute;
  top: 2rem;
  left: 0;
}
</style>
