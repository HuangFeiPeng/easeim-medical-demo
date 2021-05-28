<template>
  <div>
    <div class="file_box" @click="upDataFile">
      <input
        type="file"
        ref="updataFile"
        style="display:none;"
        @change="sendFile"
      />
      <img src="@/assets/imgs/about_input/icon／文件@2x.png" alt="" />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    upDataFile() {
      this.$refs["updataFile"].click();
    },
    sendFile() {
      let el = this.$refs["updataFile"];
      this.$emit("sendFile", el);
    }
  }
};
</script>
<style lang="scss" scoped>
.file_box {
  width: 0.49rem;
  height: 0.49rem;
  img {
    width: 0.49rem;
    height: 0.49rem;
  }
}
</style>
