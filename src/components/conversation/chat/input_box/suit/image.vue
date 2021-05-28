<template>
  <div>
    <div class="image_box" @click="upDataImg">
      <input
        type="file"
        @change="sendImg"
        ref="updataImage"
        style="display:none;"
      />
      <img src="@/assets/imgs/about_input/相册@2x.png" alt="" />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      imgData: ""
    };
  },
  methods: {
    upDataImg() {
      this.$refs["updataImage"].click();
    },
    sendImg() {
      let el = this.$refs["updataImage"];
      this.$emit("sendImg", el);
      el.value = null;
    }
  }
};
</script>
<style lang="scss" scoped>
.image_box {
  margin: 0 0.425rem;
  width: 0.49rem;
  height: 0.49rem;
  background: #fff;
  img {
    width: 0.49rem;
    height: 0.49rem;
  }
}
</style>
