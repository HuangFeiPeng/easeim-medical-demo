<template>
  <div class="moreFunc_box">
    <slot> </slot>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
}
</script>
<style lang="scss" scoped>
.moreFunc_box {
  padding: 0.25rem;
  height: 1.5rem;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  //   justify-content: space-between;
}
</style>
