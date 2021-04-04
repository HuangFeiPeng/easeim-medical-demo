<template>
  <div>
    <van-nav-bar class="nav_bar" fixed>
      <template #title>
        <!-- <van-icon name="search" size="18" /> -->
        <p v-text="title" class="text"></p>
      </template>
    </van-nav-bar>
  </div>
</template>
<script>
export default {
  name: 'Conversation',
  data() {
    return {
      title: '我的问诊',
    }
  },
  methods: {},
}
</script>
<style lang="scss" scoped>
.nav_bar{
    background: #F7F8fA;
    .text{
        color: #535568;
    }
}
</style>