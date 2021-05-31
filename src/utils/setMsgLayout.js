/* 处理消息组装发送以及接收的消息 */
import WebIM from './WebIM'
let conn = WebIM.conn;
export let setMsgLayout = (message) => {
    const nowPanient = window.Vue.$route; //拿到当前选中的患者信息。 
    console.log(window.Vue.$route); // 
    let isSelft = message.from && (message.from === conn.user ? true : false) //处理消息当前的来源
    console.log('>>>>>消息来源true是自己，false不是', isSelft);
    let isUnReadNum = !(nowPanient.path === "/disposeClinical/chat_content" && (nowPanient.query.HxId === message.from || message.from === conn.user))
    // let isUnReadNum = (nowPanient.path === "/disposeClinical/chat_content" && nowPanient.query.HxId === message.from && isSelft !== true) ? false : true;
    console.log('>>>>>isUnReadNum', isUnReadNum);
    // let isUnReadNum = (nowPanient && nowPanient.HxId === message.from) ? false : true; //处理过来的消息是否为未读（如果当前选中的患者环信ID与from的ID一致那么不是未读，否则则是未读）
    isUnReadNum && window.Vue.$store.commit('addAllReadNumCount', 1);
    isUnReadNum && window.Vue.$store.commit('updataUnReadMsgCount', {
        id: message.from,
    });
    let getTime = String(new Date().getTime());
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
            mid: message.mid ? message.mid : message.id
        }
        debugger
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
                filetype: message.body ? message.body.filetype : message.type,
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