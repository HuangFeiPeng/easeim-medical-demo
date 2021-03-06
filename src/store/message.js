import WebIM from '@/utils/WebIM';
import _ from 'lodash';
import {
    setMsgLayout
} from '@/utils/setMsgLayout';
let conn = WebIM.conn;
const message = {
    state: {
        msgList: {},
        unReadNum: {},
        nowContactMsg: []
    },
    mutations: {
        //处理添加新消息
        updataMessageList: (
            state, param) => {
            const {
                to,
                from,
            } = param;
            const key = (conn.user === to ? from : to);
            if (!state.msgList[key]) {
                state.msgList[key] = []
            }

            state.msgList[key].push(param)

            const oldMsg = {
                ...state.msgList
            }
            state.msgList = oldMsg;
        },
        //处理漫游消息进行合并
        mergeHistoryMessage: (state, param) => {
            console.log('>>>>>>>传入的历史消息', param);
            const {
                hxId,
                historyMsgArr
            } = param;
            if (!state.msgList[hxId]) {
                state.msgList[hxId] = []
                state.msgList[hxId].push(...historyMsgArr)

            } else {
                let newMsgArr = [];
                newMsgArr.push(...historyMsgArr, ...state.msgList[hxId]);
                console.log('11111++++++', newMsgArr);
                state.msgList[hxId] = newMsgArr;

                // historyMsgArr.concat(state.msgList[hxId])
            }
            // historyMsgArr.concat(state.msgList[hxId])
        },
        //处理统计各用户的未读数
        updataUnReadMsgCount: (state, payload) => {
            const {
                id,
                isDelete
            } = payload;
            if (!state.unReadNum[id]) {
                state.unReadNum[id] = {
                    num: 0
                }
            }
            if (isDelete) {
                delete state.unReadNum[id];
            } else {
                state.unReadNum[id].num += 1
            }

            //这一步是因为Vue监听无法监听到对象中下面的具体值的变化，但是对象的改变可以监听到。
            const oldUnReadNum = {
                ...state.unReadNum
            }
            state.unReadNum = oldUnReadNum
        },
        //处理音频播放状态
        updataAudioMsgPlayStatus: (state, payload) => {
            console.log('>>>>>>commit', payload);
            const {
                from,
                mid
            } = payload;
            let index = _.findIndex(state.msgList[from], function (o) {
                return o.mid == mid;
            });
            state.msgList[from][index].isPlay = true;
            console.log('>>>>>>这条消息的下标', );
        }
    },
    actions: {
        //拉取漫游消息
        onGetHistoryMessage({
            commit
        }, hxId) {
            return new Promise((resolve, reject) => {
                let options = {
                    queue: String(hxId), //需特别注意queue属性值为大小写字母混合，以及纯大写字母，会导致拉取漫游为空数组，因此注意将属性值装换为纯小写
                    isGroup: false,
                    count: 15,
                    success: function (res) {
                        console.log('>>>>>>历史消息拉取成功', res);
                        let historyMsgArr = [];
                        const historyMessage = res;
                        historyMessage && historyMessage.forEach((item, index) => {
                            let msgData = setMsgLayout(item);
                            msgData.isHistoryMsg = true
                            historyMsgArr.push(msgData)
                        });
                        commit('mergeHistoryMessage', {
                            hxId,
                            historyMsgArr
                        })
                        resolve(res)
                    },
                    fail: function () {
                        reject()
                    }
                }
                WebIM.conn.fetchHistoryMessages(options)
            })

        },
        //文本消息
        onSendTextMessage: ({
            commit
        }, data) => {
            const {
                msgData,
                hxId
            } = data;
            return new Promise((resolve, reject) => {
                let id = conn.getUniqueId(); // 生成本地消息id
                let msg = new WebIM.message('txt', id); // 创建文本消息
                msg.set({
                    from: conn.user,
                    msg: msgData, // 消息内容
                    to: hxId, // 接收消息对象（用户id）
                    chatType: 'singleChat', // 设置为单聊
                    ext: {

                    }, //扩展消息
                    success: function (id, serverMsgId) {
                        console.log('send private text Success', serverMsgId);
                        msg.body.mid = serverMsgId;
                        let msgData = setMsgLayout(msg.body)
                        commit('updataMessageList', msgData)
                        resolve(serverMsgId)
                    },
                    fail: function (e) {

                        reject(e)
                    }
                });
                conn.send(msg.body);
            })
        },
        //语音消息
        onSendAudioMessage: ({
            commit
        }, data) => {
            const {
                hxId,
                length,
                file
            } = data;
            console.log('>>>>>>语音消息', data);
            let fileUrl;
            return new Promise((resolve, reject) => {
                let id = conn.getUniqueId(); // 生成本地消息id
                let msg = new WebIM.message('audio', id); // 创建图片消息
                let option = {
                    from: conn.user,
                    file: file,
                    length: length, // 视频文件时，单位(ms)
                    ext: {
                        file_length: file.data.size // 文件大小
                    },
                    to: hxId, // 接收消息对象
                    chatType: 'singleChat', // 设置为单聊
                    onFileUploadError: function (e) { // 消息上传失败
                        window.Vue.$Toast.fail('录音上传失败，请重试！')
                        console.log('onFileUploadError', e);
                    },
                    onFileUploadComplete: function (res) { // 消息上传成功
                        console.log('onFileUploadComplete', res);
                        let url = `${res.uri}/${res.entities[0].uuid}` //拼接URL
                        return fileUrl = url;
                    },
                    success: function (id, serverMsgId) { // 消息发送成功
                        msg.body.mid = serverMsgId;
                        msg.body.fileUrl = fileUrl;
                        let msgData = setMsgLayout(msg.body)
                        console.log('succusee', msgData);
                        commit('updataMessageList', msgData)
                        resolve()

                    },
                    fail: function (e) {
                        reject(e)
                        console.log("Fail", e); //如禁言、拉黑后发送消息会失败
                    },
                    flashUpload: WebIM.flashUpload
                };
                msg.set(option);
                conn.send(msg.body);
            })

        },
        //图片消息
        onSendImageMessage: ({
            commit
        }, data) => {
            console.log('>>>>>接收图片消息', data);
            const {
                el,
                hxId
            } = data;
            let imgUrl;
            return new Promise((resolve, reject) => {
                let id = conn.getUniqueId(); // 生成本地消息id
                let msg = new WebIM.message('img', id); // 创建图片消息
                let file = WebIM.utils.getFileUrl(el); // 将图片转化为二进制文件
                console.log(file);
                let allowType = {
                    'jpg': true,
                    'jpeg': true,
                    'gif': true,
                    'png': true,
                    'bmp': true,
                    'webp': true
                };
                if (file.filetype.toLowerCase() in allowType) {
                    let option = {
                        file: file,
                        ext: {
                            file_length: file.data.size // 文件大小
                        },
                        from: conn.user,
                        to: hxId, // 接收消息对象
                        chatType: 'singleChat', // 设置为单聊
                        onFileUploadError: function () { // 消息上传失败
                            console.log('onFileUploadError');
                        },
                        onFileUploadComplete: function (res) { // 消息上传成功
                            console.log('onFileUploadComplete');
                            let url = `${res.uri}/${res.entities[0].uuid}` //拼接URL
                            return imgUrl = url;
                        },
                        success: function (id, serverMsgId) { // 消息发送成功
                            msg.body.mid = serverMsgId;
                            msg.body.fileUrl = imgUrl;
                            let msgData = setMsgLayout(msg.body)
                            console.log('succusee', msgData);
                            commit('updataMessageList', msgData)
                            resolve()
                        },
                        fail: function (e) {
                            console.log("Fail", e); //如禁言、拉黑后发送消息会失败
                            reject(e);
                        },
                        flashUpload: WebIM.flashUpload
                    };
                    msg.set(option);
                    conn.send(msg.body);
                } else {
                    window.Vue.$Toast.fail('该文件类型不被允许！');
                    return
                }
            })

        },
        //文件消息
        onSendFileMessage: ({
            commit
        }, data) => {
            const {
                hxId,
                el
            } = data;
            return new Promise((resolve, reject) => {
                let id = conn.getUniqueId(); // 生成本地消息id
                let msg = new WebIM.message('file', id); // 创建文件消息
                let file = WebIM.utils.getFileUrl(el); // 将文件转化为二进制文件
                let fileUrl;
                let allowType = {
                    'jpg': true,
                    'gif': true,
                    'png': true,
                    'bmp': true,
                    'zip': true,
                    'txt': true,
                    'doc': true,
                    'pdf': true,
                    'pptx': true,
                    'ppt': true,
                    'docx': true,
                    'excel': true,
                    'js': true,
                    'json': true,
                    'wav': true,
                    'rar': true,
                    'jpeg': true,
                    'mp3': true,
                    'mp4': true,
                };
                if (file.filetype.toLowerCase() in allowType) {
                    let option = {
                        file: file,
                        from: conn.user,
                        to: hxId, // 接收消息对象
                        chatType: 'singleChat', // 设置单聊
                        onFileUploadError: function (e) { // 消息上传失败
                            console.log('onFileUploadError', e);

                        },
                        onFileUploadComplete: function (res) { // 消息上传成功
                            console.log('onFileUploadComplete', res);
                            let url = `${res.uri}/${res.entities[0].uuid}` //拼接URL
                            return fileUrl = url;
                        },
                        success: function (id, serverMsgId) { // 消息发送成功
                            msg.body.mid = serverMsgId;
                            msg.body.fileUrl = fileUrl;
                            let msgData = setMsgLayout(msg.body)
                            commit('updataMessageList', msgData)
                            resolve()

                        },
                        fail: function (e) {
                            console.log(e);
                            reject(e)
                        },
                        flashUpload: WebIM.flashUpload,
                        ext: {
                            file_length: file.data.size
                        }
                    };
                    msg.set(option);
                    conn.send(msg.body);
                } else {
                    window.Vue.$Toast.fail('上传文件类型暂不支持！')
                }
            })

        },
        //提交要查找修改的音频消息播放状态
        onSetAudioMsgPlayStatus: ({
            commit
        }, msgData) => {
            commit('updataAudioMsgPlayStatus', msgData)
        }
    },
    getters: {

    }
}

export default message