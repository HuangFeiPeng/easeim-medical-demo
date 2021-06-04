import Mock from 'mockjs';
let Random = Mock.Random
const HxId = ['111', '222', '333', '444', '555', '666']
let patient_infoList = []
const count = 15;

for (let i = 0; i < count; i++) {
    let RandomHxId = "";
    RandomHxId = HxId[Math.floor((Math.random() * HxId.length))]
    patient_infoList.push(Mock.mock({
        'personal_details': {
            'sex|1': true, //男或女
            'age|0-120': 0, //年龄
            'weight|50-100': 50, //体重
            'liver|1': true, //肝功能
            'kidney|1': true, //肾功能
            'breed|1': true, //是否生育
            'irr|1': ['有过过敏史', '从来没有过', '青霉素过敏', '红霉素过敏', '代码过敏'], //过敏史
            'all|1': ['脚气', '痔疮', '没有', '胃溃疡', '心脏病', '糖尿病'], //过往病史

        },
        'illness_details': {
            'decs|50-150': "@cword", //病情描述
            'decs_img|3': [Random.image('88x57', Random.color())] //病情图片
        }
    }))


}
console.log('>>>>>>>>>>>>>', JSON.stringify(patient_infoList));

export default {
    getPatientInfor: () => {
        return patient_infoList
    }
}