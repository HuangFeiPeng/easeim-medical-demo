<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
import { setMsgLayout, changeType } from "./utils/setMsgLayout";
export default {
  created() {
    let vm = this; //该this为Vue实例
    // console.log(this);
    this.$conn.listen({
      onOpened: function() {
        vm.$Toast.success("登陆成功");
        vm.$store.commit("changeUserState", { condition: "loginSuccess" }),
          vm.$router.push("/home").catch(err => {
            console.log(err);
          });
        vm.$store.dispatch("getConverData");
      }, //连接成功回调
      onClosed: function() {
        console.log(">>>>连接关闭");
        vm.$store.commit("changeUserState", { condition: "socketClosed" }),
          vm.$Toast.success("已退出");
        setTimeout(() => {
          vm.$router.push("/login").catch(err => {
            console.log(err);
          }),
            vm.$Toast.clear();
        }, 700);
      }, //连接关闭回调
      onTextMessage: function(message) {
        console.log("text", message);
        message.type = changeType(message);
        let msgData = setMsgLayout(message);
        vm.$store.commit("updataMessageList", msgData);
      }, //收到文本消息
      onPictureMessage: function(message) {
        console.log("img", message);
        message.type = changeType(message);
        let msgData = setMsgLayout(message);
        vm.$store.commit("updataMessageList", msgData);
      }, //收到图片消息
      onCmdMessage: async message => {
        console.log("cmd", message);
        const { action, ext } = message;
        console.log(">>>>>>action", action);
        switch (action) {
          case "busy": //忙碌
            {
              vm.$Notify("对方正忙！");
              vm.$Bus.$emit("busy");
            }
            break;
          case "calleReady": //已准备
            {
              console.log(">>>>>>>被叫已准备好", message);
              await vm.$store.dispatch("ackChannelName", message);
            }
            break;
          case "ackChannelName": //房间名告知
            {
              await vm.$store.dispatch("backChannelName", message);
            }
            break;
          case "backChannelName": //返回房间名
            {
              await vm.$store.dispatch("alertPage", message);
            }
            break;
          case "alertPage": //弹出待接听页面
            {
              console.log(">>>>>>>alertPage根据结果看是否进入带接听页");
              if (ext && ext.result) {
                const { from, ext } = message;
                vm.$store.commit("updataChannelName", ext.channelName);
                if (ext.avType === "audio") {
                  await vm.$router.push({
                    name: "AudioCall",
                    params: { HxId: from }
                  });
                } else {
                  await vm.$router.push({
                    name: "VideoCall",
                    params: { HxId: from }
                  });
                }
              }
            }
            break;
          case "giveUpCall": //放弃呼叫
            {
              vm.$store.commit("initRtcStatus");
              vm.$router.back(-1);
            }
            break;
          case "refuseCall": //拒绝接听
            {
              vm.$store.commit("initRtcStatus");
              vm.$router.back(-1);
            }
            break;
          case "normalHangUp": //正常挂断
            {
              let type = "calledHangUp"; //正常通话中的挂断执行挂断,另一方收到回执。
              vm.$Bus.$emit("normalHangUp", type);

              // vm.$store.commit("initRtcStatus");
              // vm.$router.back(-1);
              // console.log(">>>>>>>>>接收到挂断通知");
            }
            break;
          case "answerCalle": //确认接听
            {
              vm.$store.commit("updataAvStatus", 7);
              vm.$Bus.$emit("startTimer");
            }
            break;
          default:
            break;
        }
      }, //收到命令消息
      onAudioMessage: function(message) {
        console.log(">>>>>收到音频消息", message.url);
        if (message.url) {
          var options = {
            url: message.url,
            headers: {
              Accept: "audio/amr"
            }
          };
          options.onFileDownloadComplete = function(response) {
            //音频下载成功，需要将response转换成blob，使用objectURL作为audio标签的src即可播放。
            var objectURL = vm.$WebIM.utils.parseDownloadResponse.call(
              vm.$conn,
              response
            );
            console.log("转译之后", objectURL);
          };

          options.onFileDownloadError = function() {
            //音频下载失败
            console.log("失败");
          };
          //通知服务器将音频转为mp3
          vm.$WebIM.utils.download.call(vm.$conn, options);
          console.log(options);
        }
        message.type = changeType(message);
        let msgData = setMsgLayout(message);
        vm.$store.commit("updataMessageList", msgData);
      }, //收到音频消息
      onCustomMessage: async message => {
        const { ext } = message;
        const avStatus = vm.$store.state.Agroa.avStatus;
        console.log(">>>>>>>>avStatus", avStatus);
        if (avStatus > 0 && avStatus === 1) {
          await vm.$store.dispatch("calleBusy", message);
        } else {
          const nowTime = new Date().getTime();
          //与当前登录时间大于1分钟就忽略，小于一分钟可以进行加入
          if (nowTime - ext.ts < 60000) {
            message.ext = message.customExts; //取出消息体内的拨打类型传入进去
            await vm.$store.dispatch("calleReady", message);
          }
        }
        console.log(">>>>>>>收到自定义消息", message);
      }, //收到自定义消息
      onFileMessage: function(message) {
        console.log("file", message);
        message.type = changeType(message);
        let msgData = setMsgLayout(message);
        vm.$store.commit("updataMessageList", msgData);
      }, //收到文件消息
      onVideoMessage: function(message) {
        var node = document.getElementById("privateVideo");
        var option = {
          url: message.url,
          headers: {
            Accept: "audio/mp4"
          },
          onFileDownloadComplete: function(response) {
            var objectURL = this.$WebIM.utils.parseDownloadResponse.call(
              this.$conn,
              response
            );
            node.src = objectURL;
          },
          onFileDownloadError: function() {
            console.log("File down load error.");
          }
        };
        this.$WebIM.utils.download.call(this.$conn, option);
      }, //收到视频消息
      onPresence: function(message) {}, //处理“广播”或“发布-订阅”消息，如联系人订阅请求、处理群组、聊天室被踢解散等消息
      onRoster: function(message) {}, //处理好友申请
      onInviteMessage: function(message) {}, //处理群组邀请
      onOnline: function() {}, //本机网络连接成功
      onOffline: function() {}, //本机网络掉线
      onError: function(message) {
        console.log(">>>>>>error", message);
      }, //失败回调
      onBlacklistUpdate: function(list) {
        //黑名单变动
        // 查询黑名单，将好友拉黑，将好友从黑名单移除都会回调这个函数，list则是黑名单现有的所有好友信息
        console.log(list);
      },
      onRecallMessage: function(message) {}, //收到撤回消息回调
      onReceivedMessage: function(message) {}, //收到消息送达服务器回执
      onDeliveredMessage: function(message) {}, //收到消息送达客户端回执
      onReadMessage: function(message) {}, //收到消息已读回执
      onCreateGroup: function(message) {}, //创建群组成功回执（需调用createGroupNew）
      onMutedMessage: function(message) {}, //如果用户在A群组被禁言，在A群发消息会走这个回调并且消息不会传递给群其它成员
      onChannelMessage: function(message) {} //收到整个会话已读的回执，在对方发送channel ack时会在这个回调里收到消息
    });
  }
};
</script>
<style>
@import url("./assets/initCss/_reset.scss");
/* @import url('./assets/initCss/_minxin.scss'); */
</style>
