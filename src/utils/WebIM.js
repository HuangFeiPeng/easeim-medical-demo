import websdk from 'easemob-websdk';
import config from './WebIMConfig';
import AgoraRTC from "agora-rtc-sdk-ng"

let conn = {}
let WebIM = {}
WebIM = websdk
WebIM.AgoraRTC = AgoraRTC
WebIM.config = config
conn = WebIM.conn = new WebIM.connection({
    appKey: WebIM.config.appkey,
    isHttpDNS: WebIM.config.isHttpDNS,
    isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
    https: WebIM.config.https,
    url: WebIM.config.socketServer,
    apiUrl: WebIM.config.restServer,
    isAutoLogin: WebIM.config.isAutoLogin,
    autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
    autoReconnectInterval: WebIM.config.autoReconnectInterval,
    delivery: WebIM.config.delivery,
    useOwnUploadFun: WebIM.config.useOwnUploadFun
})
// WebIM.config 为之前集成里介绍的WebIMConfig.js

export default WebIM

// export default class WebIM {
//     constructor() {
//         this.conn = new websdk.connection({
//             ...config
//         })
//     }
// }