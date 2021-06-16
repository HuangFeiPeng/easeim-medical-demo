/* 处理消息组装发送以及接收的消息 */
import WebIM from './WebIM'
let conn = WebIM.conn;
export let setMsgLayout = (message) => {

    const nowPanient = window.Vue.$route; //拿到当前选中的患者信息。 
    let isSelft = message.from && (message.from === conn.user ? true : false) //处理消息当前的来源
    let isUnReadNum = !(nowPanient.path === "/disposeClinical/chat_content" && (nowPanient.query.HxId === message.from || message.from === conn.user))
    // let isUnReadNum = (nowPanient && nowPanient.HxId === message.from) ? false : true; //处理过来的消息是否为未读（如果当前选中的患者环信ID与from的ID一致那么不是未读，否则则是未读）
    isUnReadNum && window.Vue.$store.commit('addAllReadNumCount', 1);
    isUnReadNum && window.Vue.$store.commit('updataUnReadMsgCount', {
        id: message.from,
    });
    let getTime = String(new Date().getTime());
    let fileType = message.filename && message.filename.slice([message.filename.lastIndexOf('.') + 1]) //截取他人发过来的文件类型

    //转换type类型 如果message体中含有contentsType，则说明是他人发的消息将type转换。
    message.contentsType && (message.type = changeType(message))
    const {
        type
    } = message;
    let msg = {};
    if (type === 'txt') {

        msg = {
            from: message.from,
            to: message.to,
            ext: message.ext,
            content: message.msg ? message.msg : message.data,
            chatType: message.contentsType ? message.contentsType : "TEXT",
            time: message.time ? message.time : getTime,
            self: isSelft,
            unReadNum: isUnReadNum,
            mid: message.mid ? message.mid : message.id
        }
    }
    if (type === 'audio') {
        msg = {
            from: message.from,
            to: message.to,
            ext: message.ext,
            file: {
                file_length: message.body ? message.body.file_length : message.file_length,
                filetype: message.body ? message.body.filetype : message.type,
                url: message.fileUrl ? message.fileUrl : message.url,
                length: message.length
            },
            chatType: message.contentsType ? message.contentsType : "VOICE",
            time: message.time ? message.time : getTime,
            self: isSelft,
            mid: message.mid ? message.mid : message.id,
            isPlay: !isSelft ? false : true
        }
    }
    if (type === 'img') {
        msg = {
            from: message.from,
            to: message.to,
            ext: message.ext,
            file: {
                file_length: message.body ? message.body.file_length : message.file_length,
                filetype: message.body ? message.body.filetype : message.type,
                url: message.fileUrl ? message.fileUrl : message.url,
                filename: message.body ? message.body.filename : message.filename,

            },
            chatType: message.contentsType ? message.contentsType : "IMAGE",
            time: message.time ? message.time : getTime,
            self: isSelft,
            mid: message.mid ? message.mid : message.id
        }
    }
    if (type === 'file') {
        msg = {
            from: message.from,
            to: message.to,
            ext: message.ext,
            file: {
                file_length: message.body ? message.body.file_length : message.file_length,
                filetype: message.body ? message.body.filetype : fileType,
                url: message.fileUrl ? message.fileUrl : message.url,
                filename: message.body ? message.body.filename : message.filename,
            },
            chatType: message.contentsType ? message.contentsType : "FILE",
            time: message.time ? message.time : getTime,
            self: isSelft,
            mid: message.mid ? message.mid : message.id
        }
    }

    return msg;
}
export let changeType = (msg) => {
    let type = {
        'TEXT': 'txt',
        'IMAGE': 'img',
        'FILE': 'file',
        'VOICE': 'audio'
    }
    return type[msg.contentsType]
}