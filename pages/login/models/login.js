import {
  HTTP
} from '../../../utils/http.js'

class LoginModel extends HTTP {

  getSms(mobile, callback) {
    var params = {
      url: '/api/auth/sms',
      type: 'GET',
      data: {
        mobile: mobile
      },
      sCallback: callback
    }
    this.request(params)
  }

  postVerify(mobile, code, callback) {
    var params = {
      url: '/api/ser/auth/verify',
      type: 'POST',
      data: {
        mobile: mobile,
        code: code
      },
      sCallback: callback
    }
    this.request(params)
  }

  // 注册
  postRegister(params, callback) {
    var params = {
      url: '/api/ser/auth/register',
      type: 'POST',
      data: {
        mobile: params.phone,
        password: params.password,
        repeat_password: params.rePassword,
        code: params.code,
        type: params.companyType,
        name: params.company,
        short_name: params.shortName
      },
      sCallback: callback
    }
    this.request(params)
  }

  // 登录
  postLogin(params, callback) {
    var params = {
      url: '/api/ser/auth/login',
      type: 'POST',
      data: {
        mobile: params.phone,
        password: params.password
      },
      sCallback: callback
    }
    this.request(params)
  }

  // 修改密码
  modifyPwd(params, callback) {
    var params = {
      url: '/api/ser/index/changePwd',
      type: 'POST',
      auth: true,
      data: {
        old_password: params.oldPassword,
        password: params.password,
        repeat_password: params.repeatPassword
      },
      sCallback: callback
    }
    this.request(params)
  }

  // 忘记密码
  forgetPwd(param, callback) {
    var params = {
      url: '/api/ser/auth/forget',
      type: 'POST',
      data: param,
      sCallback: callback
    }
    this.request(params)
  }
}
export {
  LoginModel
}