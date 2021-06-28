import axios from 'axios';
import WebIM from '../utils/WebIM';
const CALLSTATUS = {
    idle: 0, //闲置中
    inviting: 1, //邀请中
    alerting: 2, //弹窗中
    confirmRing: 3, // 被叫确定中
    receivedConfirmRing: 4, // 被呼叫中
    answerCall: 5, //应答中
    receivedAnswerCall: 6, //无应答
    confirmCallee: 7
}
const agroa = {
    state: {
        rtc: {
            // 用来放置本地客户端。
            client: null,
            // 用来放置本地音视频频轨道对象。
            localAudioTrack: null,
            localVideoTrack: null
        },
        avStatus: CALLSTATUS.idle, //当前状态
        channelName: '' //房间名
    },
    mutations: {
        updataClient: (state, parmas) => {
            console.log(">>>>>parmas", parmas);
            if (parmas.client) {
                state.rtc.client = parmas.client
            }
            if (parmas.localAudioTrack) {
                state.rtc.localAudioTrack = parmas.localAudioTrack
            }
        },
        updataAvStatus: (state, type) => {
            console.log(type);
            state.avStatus = type
        },
        updataChannelName: (state, data) => {
            console.log('>>>>>>设定房间名', data);
            state.channelName = data;
        },
        initRtcStatus: (state) => {
            state.avStatus = CALLSTATUS.idle;
            state.channelName = ''
        }
    },
    actions: {
        //初始化client
        setRtcClient: (context, payload) => {
            console.log('>>>>>>>>初始化client调用完成', payload);
            const {
                client
            } = payload;
            context.commit('updataClient', {
                client
            })
        },
        //更新本地音频轨道对象
        setLocalAudioTrack: (context, payload) => {
            context.commit('updataClient', payload)
        },
        //主叫操作发送邀请
        sendInviteMessage: (context, payload) => {
            const {
                HxId,
                avType,

            } = payload
            console.log('>>>>>>发送邀请信息', payload);
            let id = WebIM.conn.getUniqueId(); // 生成本地消息id
            let msg = new WebIM.message('custom', id); // 创建自定义消息
            let customEvent = "inviteCall"; // 创建自定义事件
            let customExts = avType === 0 ? {
                avType: 'audio'
            } : {
                avType: 'video'
            }; // 消息内容，key/value 需要 string 类型
            msg.set({
                to: String(HxId), // 接收消息对象（用户id）
                customEvent,
                customExts,
                ext: {
                    callerId: WebIM.conn.context.jid.clientResource,
                    ts: new Date().getTime()
                },
                chatType: 'singleChat', // 消息扩展
                success: function (id, serverMsgId) {
                    console.log('>>>>>>邀请信息发送成功', serverMsgId);

                    context.commit('updataAvStatus', CALLSTATUS.inviting)
                },
                fail: function (e) {}
            });
            console.log('>>>>>>>>>msg', msg.body);
            WebIM.conn.send(msg.body);


        },
        //被叫就绪回执
        calleReady: (context, payload) => {
            console.log('>>>>>>发送被叫准备就绪回执', payload);
            const {
                from,
                ext
            } = payload;
            let toId = from;
            let id = WebIM.conn.getUniqueId(); //生成本地消息id
            let msg = new WebIM.message('cmd', id); //创建命令消息

            msg.set({
                to: String(toId), //接收消息对象
                action: 'calleReady', //用户自定义，cmd消息必填
                ext: {
                    ...ext,
                    'tips': '被叫方已经准备就绪回执'
                }, //用户自扩展的消息内容（群聊用法相同）
                success: function (id, serverMsgId) {
                    console.log('>>>>>>命令消息发送成功', serverMsgId);
                    // context.commit.updataAvStatus('updataAvStatus', CALLSTATUS.idle)

                }, //消息发送成功回调 
                fail: function (e) {
                    console.log("Fail"); //如禁言、拉黑后发送消息会失败
                }
            });

            WebIM.conn.send(msg.body);

        },
        //主叫在收到就绪回执时发送房间名
        ackChannelName: (context, payload) => {
            const channelName = context.state.channelName
            console.log('>>>>>>>>ackChannelName的房间名', channelName);
            const {
                from,
                ext
            } = payload;
            const toId = from;
            if (channelName) {
                let id = WebIM.conn.getUniqueId(); //生成本地消息id
                let msg = new WebIM.message('cmd', id); //创建命令消息

                msg.set({
                    to: String(toId), //接收消息对象
                    action: 'ackChannelName', //用户自定义，cmd消息必填
                    ext: {
                        'channelName': channelName,
                        "avType": 0,
                        'tips': '主叫在收到被叫准备就绪回执时发送房间名'
                    }, //用户自扩展的消息内容（群聊用法相同）
                    success: function (id, serverMsgId) {
                        console.log('>>>>>>命令消息发送成功', serverMsgId);

                    }, //消息发送成功回调 
                    fail: function (e) {
                        console.log("Fail", e); //如禁言、拉黑后发送消息会失败
                    }
                });
                WebIM.conn.send(msg.body);
            } else {
                return;
            }

        },
        //被叫返回收到的房间名 让主叫确认该房间名是否有效
        backChannelName: (context, payload) => {
            console.log('>>>>>>>收到被叫返回的房间名', payload);
            const {
                from,
                ext
            } = payload;
            const toId = from;
            let id = WebIM.conn.getUniqueId(); //生成本地消息id
            let msg = new WebIM.message('cmd', id); //创建命令消息

            msg.set({
                to: String(toId), //接收消息对象
                action: 'backChannelName', //用户自定义，cmd消息必填
                ext: {
                    'channelName': ext.channelName,
                    'tips': '被叫返回房间名，确认该房间名是否有效'
                }, //用户自扩展的消息内容（群聊用法相同）
                success: function (id, serverMsgId) {
                    console.log('>>>>>>命令消息发送成功', serverMsgId);

                }, //消息发送成功回调 
                fail: function (e) {
                    console.log("Fail", e); //如禁言、拉黑后发送消息会失败
                }
            });
            WebIM.conn.send(msg.body);
        },
        //主叫判断返回的房间名是否为当前已经创建的房间名，并将结果返回给被叫方从而决定是否弹出待接听页面
        alertPage: (context, payload) => {
            console.log('>>>>++++++++进入主叫判断back回来的会议是否有效阶段', payload);
            const {
                from,
                ext
            } = payload;
            const toId = from;
            const channelName = context.state.channelName;
            console.log('>>>>>>>当前的房间名为', (channelName === ext.channelName), ext.channelName);
            let result = (channelName == ext.channelName) ? true : false;
            let id = WebIM.conn.getUniqueId(); //生成本地消息id
            let msg = new WebIM.message('cmd', id); //创建命令消息
            msg.set({
                to: String(toId), //接收消息对象
                action: 'alertPage', //用户自定义，cmd消息必填
                ext: {
                    'channelName': ext.channelName,
                    'tips': '主叫发送校验房间名是否有效的结果',
                    'result': result
                }, //用户自扩展的消息内容（群聊用法相同）
                success: function (id, serverMsgId) {
                    if (result) { //如果会议有效 那么将当前状态改为 弹窗中(对方进入弹窗)
                        context.commit('updataAvStatus', CALLSTATUS.alerting)
                    }
                    console.log('>>>>>>命令消息发送成功', serverMsgId);

                }, //消息发送成功回调 
                fail: function (e) {
                    console.log("Fail", e); //如禁言、拉黑后发送消息会失败
                }
            });
            WebIM.conn.send(msg.body);


        },
        //被叫正忙
        calleBusy: (context, payload) => {
            console.log('>>>>>>>>被叫正忙触发', payload);
            const {
                from,
                customEvent
            } = payload
            if (customEvent === "inviteCall") {
                let toId = from;
                let id = WebIM.conn.getUniqueId(); //生成本地消息id
                let msg = new WebIM.message('cmd', id); //创建命令消息

                msg.set({
                    to: String(toId), //接收消息对象
                    action: 'busy', //用户自定义，cmd消息必填
                    ext: {
                        'nowStatus': context.state.avStatus
                    }, //用户自扩展的消息内容（群聊用法相同）
                    success: function (id, serverMsgId) {
                        console.log('>>>>>>命令消息发送成功', serverMsgId);
                        context.commit.updataAvStatus('updataAvStatus', CALLSTATUS.idle)

                    }, //消息发送成功回调 
                    fail: function (e) {
                        console.log("Fail"); //如禁言、拉黑后发送消息会失败
                    }
                });

                WebIM.conn.send(msg.body);
            }

        },
        //挂断操作,不同的阶段执行不同的挂断状态
        onHuangUp: (context, payload) => {
            console.log('>>>>>>>执行挂断', payload);
            const {
                type,
                HxId
            } = payload;
            /* 
                0 对方还未弹窗 那就直接初始化 挂断。
                1 对方已经弹窗 主叫方放弃呼叫 挂断
                2 被叫方拒绝主叫方的呼叫而执行挂断。
            */
            let sendInitMsg = (type, toId) => {
                console.log('<>>>>>>>>>>>>>type, toId', type, toId);
                const sendType = {
                    0: 'giveUpCall',
                    1: 'refuseCall'
                }
                let id = WebIM.conn.getUniqueId(); //生成本地消息id
                let msg = new WebIM.message('cmd', id); //创建命令消息
                msg.set({
                    to: toId, //接收消息对象
                    action: sendType[type], //用户自定义，cmd消息必填
                    ext: {
                        'tips': '通知对面进行初始化操作'
                    }, //用户自扩展的消息内容（群聊用法相同）
                    success: function (id, serverMsgId) {
                        console.log('>>>>>>>初始化消息发送成功', serverMsgId);
                    }, //消息发送成功回调 
                    fail: function (e) {
                        console.log("Fail"); //如禁言、拉黑后发送消息会失败
                    }
                });

                WebIM.conn.send(msg.body);
            }
            if (type === 0) {
                console.log('>>>>>>>普通初始化');
                context.commit('initRtcStatus')
            }
            if (type === 1) {
                console.log('>>>>>>>主叫挂断通知被叫初始化');
                sendInitMsg(0, HxId)
                context.commit('initRtcStatus')

            }
            if (type === 2) {
                console.log('>>>>>>>>>被叫方拒绝主叫方的呼叫通知主叫初始化');
                sendInitMsg(1, HxId)
            }

        },
        getRtctoken: (context, payload) => {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + WebIM.conn.context.accessToken;
            let {
                username,
                channelName,
                appkey
            } = payload
            console.log('>>>>>>>getRtctoken', payload);
            return axios.get(`//a1.easemob.com/token/rtcToken?userAccount=${username}&channelName=${channelName}&appkey=${encodeURIComponent(appkey)}`)
                .then(function (response) {
                    return response.data
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
    },
    getters: {

    }
}

export default agroa;