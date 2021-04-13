import Mock from 'mockjs';
let Random = Mock.Random
const HxId = ['111', '222', '333', '444', '555', '666']
let convasationsList = [];
const count = 15


for (let i = 0; i < count; i++) {
    let RandomHxId = "";
    RandomHxId = HxId[Math.floor((Math.random() * HxId.length))]
    convasationsList.push(Mock.mock({
        'id': '@increment',
        'avatar': Random.image('100x100', Random.color()),
        'name': '@cname',
        'diagnoseType|0-2': 0, //诊断类型：0图文 1音频 2视频
        'diagnoseState|0-3': 0, //诊断状态：0待接诊 1进行中 2问诊结束 3已退诊
        'HxId': RandomHxId,
        'time': new Date().getTime(),
        'lastMsg|5-30': '@cword'
    }))

}

export default {
    getConvsersation: () => {
        return convasationsList
    }
}