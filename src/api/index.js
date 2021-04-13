import Axios from 'axios';

//获取会话列表
export function getConData(){
    return Axios.get('/conversation/data')
}

//获取患者信息
export function getPatientInfor(){
        return Axios.get('/patientinfor/data')
}


