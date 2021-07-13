const Toast = window.Vue.$Toast

function handleError(errCode) {
    const {
        type,
        data
    } = errCode;
    console.log('>>>>>>>errCode', errCode);
    switch (type) {
        case 501: {
            Toast.fail('消息内容含有敏感词！')

        }
        break;
    case 503: {
        Toast.fail('内容含有undefined!')

    }
    break;
    case 504: {
        Toast.fail('撤回消息时超出撤回时间!')

    }
    break;
    case 505: {
        Toast.fail('未开通消息撤回!')

    }
    break;
    case 506: {
        Toast.fail('没有在群组或聊天室白名单!')
    }
    break;
    case 'DEVICE_NOT_FOUND': {
        Toast.fail('请打开媒体设备!')
    }
    break;
    default:
        break;
    }
}

// e.type === '603' 被禁言
// e.type === '605' 群组不存在
// e.type === '602' 不在群组或聊天室中
// e.type === '504' 撤回消息时超出撤回时间
// e.type === '505' 未开通消息撤回
// e.type === '506' 没有在群组或聊天室白名单
// e.type === '503' 未知错误
export default handleError