/* 处理消息组装发送以及接收的消息 */
import message from '../store/message';
import WebIM from './WebIM'
let conn = WebIM.conn;
export let setMsgLayout = (message) => {
    console.log('>>>>>>message', message);
    let isSelft = message.from && (message.from === conn.user ? true : false)
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