//mock数据配置页
import Mock from 'mockjs';
import test1 from './conversation';
import test2 from './patient_infor';
/* 
Mock.mock(url,method,options)
参数1： 类似后台给的接口，vue文件中要调用的url
参数2： 请求方式
参数3： 配置的获取参数的方法 
*/
Mock.mock('/conversation/data','get',test1.getConvsersation) //获取会话列表
Mock.mock('/patientinfor/data','get',test2.getPatientInfor) //获取病人详情
