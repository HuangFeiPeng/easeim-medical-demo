import {
    getConData,
    getPatientInfor
} from '@/api/index'
import _ from 'lodash';
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
        changeDiagnoseState:(state,payload)=>{
            const {name,stateNum} = payload
             let index = _.findIndex(state.conversationList, function(o) { return o.name == name; });
            console.log(state.conversationList[index]);
            if (name === state.nowPanientDetil.name) {
                state.nowPanientDetil.diagnoseState = stateNum
            }
            state.conversationList[index].diagnoseState = stateNum
            
        }
    },
    actions: {
        //请求会话数据
        getConverData: (context, parms) => {
            getConData().then(res => {
                let converData = res.data;
                converData.forEach(item => {
                    // console.log(item);
                });
                if (!converData.length || converData.length == 0) {
                    context.commit('changeEmpty', true)
                } else {
                    context.commit('changeEmpty', false)
                }
                context.commit('updataConversationList', {
                    data: converData
                })
            }).catch(err => {
                console.log('>>>>>>接口请求失败', err);
            })
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
                context.commit('uploadPanientDetil',info);
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