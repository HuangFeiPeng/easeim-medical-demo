<template>
  <div class="conversation main_content">
    <!-- 空状态样式组件 -->
    <van-empty description="暂无问诊消息" v-if="isEmptyState" />
    <!-- 有会话数据显示部分 -->
    <!-- <ConverList></ConverList> -->
    <div class="conversation_content_box" v-if="!isEmptyState">
      <div
        v-for="(item, idx) in Conversation"
        :key="idx"
        class="conversation_list"
        @click="disposeClinical(item)"
      >
        <div class="conver_box van-hairline--bottom">
          <img
            src="../../assets/imgs/头像／单人头像-圆形备份 4@2x.png"
            alt=""
            class="avatar"
          />
          <div class="conver_main">
            <div>
              <p class="name">{{ item.name }}</p>
              <van-tag
                class="tag"
                color="#EEb16E"
                v-if="item.diagnoseType === 0"
                >图文</van-tag
              >
              <van-tag
                class="tag"
                color="#22AC9C"
                v-else-if="item.diagnoseType === 1"
                >音频</van-tag
              >
              <van-tag class="tag" color="#1484FB" v-else>视频</van-tag>
            </div>

            <p class="lastMsg">{{ item.lastMsg }}</p>
          </div>
          <div class="conver_type">
            <span class="time">下午10:13</span>
            <span
              class="diagnoseState"
              :style="diagnoseTypeColor[item.diagnoseState]"
              >{{ item.diagnoseState | filterDiagnoseType }}</span
            >
          </div>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import './conversation.scss'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'Conversation',
  data() {
    return {
      title: '我的问诊',
      diagnoseTypeColor: {
        0: 'color:#F7B500',
        1: 'color:#0AC195',
        2: 'color:#9FA4AE',
        3: 'color:#9FA4AE',
      },
    }
  },
  computed: {
    Conversation() {
      return this.$store.state.Conversation.conversationList
    },
    isEmptyState() {
      return this.$store.state.Conversation.isEmpty
    },
  },
  filters: {
    filterDiagnoseType(val) {
      let type = {
        0: '待接诊',
        1: '进行中',
        2: '问诊结束',
        3: '已退诊',
      }
      return type[val]
    },
  },
  methods: {
    ...mapActions(['getPainentDetial']),
    //前往病人详情页
    async disposeClinical(data) {
      const { HxId, diagnoseState, name } = data
      await this.getPainentDetial({ HxId, diagnoseState, name })
      await this.$router.push('/disposeClinical')
    },
  },
}
</script>
<style lang="scss" scoped></style>
