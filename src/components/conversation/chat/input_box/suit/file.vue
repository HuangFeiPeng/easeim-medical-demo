<template>
  <div>
    <div class="file_box" @click="sendFile">
      <input type="file" ref="updataFile" style="display:none;" />
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
    sendFile() {
      this.$refs["updataFile"].click();
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
