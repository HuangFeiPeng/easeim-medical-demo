<template>
  <div>
    <div class="image_box" @click="sendImg">
      <input type="file" ref="updataImage" style="display:none;" />
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
    async sendImg() {
      this.$refs["updataImage"].click();
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
