import {
    getConData,
    getPatientInfor,
} from '@/api/index';
import Storage from '@/utils/Storage';
import _ from 'lodash';
const localConverList = Storage.getStorage('conversationList');
const conversation = {
    state: {
        isEmpty: true, //会话空状态
        conversationList: [], //会话列表
        nowPanientDetil: {} //当前患者信息

    },
    mutations: {
        updataConversationList: (state, payload) => {
            const {
                data
            } = payload
            state.conversationList = data
        },
        changeEmpty: (state, type) => {
            state.isEmpty = type
        },
        uploadPanientDetil: (state, payload) => {
            // console.log(payload);
            // state.nowPanientDetil = Object.assign({},payload)
            state.nowPanientDetil = payload
        },
        //更改诊断状态
        changeDiagnoseState: (state, payload) => {
            const {
                name,
                stateNum
            } = payload
            let index = _.findIndex(state.conversationList, function (o) {
                return o.name == name;
            });
            console.log(state.conversationList[index]);
            if (name === state.nowPanientDetil.name) { //如果传入的name 为当前选中的用户name,则同步修改diagnoseState
                state.nowPanientDetil.diagnoseState = stateNum
            }
            state.conversationList[index].diagnoseState = stateNum
        },
        //赋空当前患者信息
        initNowPanientDetil: (state) => {
            state.nowPanientDetil = {}
        }
    },
    actions: {
        //请求会话数据
        getConverData: (context, parms) => {
            //如果本地存在有会话list那么直接取本地的会话list，如果没有则调用接口请求。
            // console.log(getConData().then(res => {
            //     console.log(res);
            // }));
            // if (!localConverList) {
            getConData().then(res => {
                let converData = res.data;
                if (!converData.length || converData.length == 0) {
                    context.commit('changeEmpty', true)
                } else {
                    context.commit('changeEmpty', false)
                }
                // Storage.setStorage('conversationList', converData);
                context.commit('updataConversationList', {
                    data: converData
                })
            }).catch(err => {
                console.log('>>>>>>接口请求失败', err);
            })
            // } else {
            //     if (!localConverList.length || localConverList.length == 0) {
            //         context.commit('changeEmpty', true)
            //     } else {
            //         context.commit('changeEmpty', false)
            //     }
            //     context.commit('updataConversationList', {
            //         data: localConverList
            //     })
            // }

        },
        //请求患者信息
        getPainentDetial: (context, parms) => {
            // console.log(parms);
            let randomNum = Math.floor(Math.random() * 10)

            const {
                HxId,
                diagnoseState,
                name
            } = parms;
            getPatientInfor().then(res => {
                // console.log(res.data[randomNum]);
                let detil = res.data[randomNum]
                let info = {
                    HxId,
                    diagnoseState,
                    name,
                    detil
                }
                context.commit('uploadPanientDetil', info);
            }).catch(err => {
                console.log('>>>请求失败', err);
            })
        }
    },
    getters: {
        conversationList(state) {
            return state.conversationList
        }
    }
}

export default conversation