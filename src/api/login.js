import { get, post } from './base'
// 发送短信验证码接口
export const sendCodeMsg = param => post('/mallUser/user/h5/sendCodeMsg', param, { showLoading: false })
// 登录注册接口
export const goLogin = param => post('/mallUser/user/h5/login', param, { showLoading: false, showToast: false })
// 退出登录
export const outLogin = param => post('/mallUser/user/h5/outLogin', param)
