// 注册
import WxValidate from '../../../dist/WxValidate.js'
import {
  LoginModel
} from '../models/login.js'

var loginModel = new LoginModel()
Page({
  data: {
    register: {
      title: '注册Goodkeys企业版账号'
    },
    codetime: 0,
    isDisabled: false,
    formData: {
      phone: '',
      password: '',
      rePassword: '',
      code: '',
    }
  },
  onLoad: function(options) {
    this.initValidate() // 验证规则函数
  },
  initValidate() {
    const rules = {
      phone: {
        required: true,
        tel: true
      },
      code: {
        required: true
      },
      password: {
        required: true,
        minlength: 6
      },
      rePassword: {
        required: true
      },

    }
    const messages = {
      phone: {
        required: '请填写手机号',
        tel: '请填写正确的手机号'
      },
      code: {
        required: '请填写验证码'
      },
      password: {
        required: '请填写密码',
        minlength: '密码不少于6个字符'
      },
      rePassword: {
        required: '请再次确认密码'
      },
    }
    this.WxValidate = new WxValidate(rules, messages)
  },

  phoneInput(e) {
    this.data.formData.phone = e.detail.value
  },

  getCodeNum() {
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/
    let params = this.data.formData.phone
    if (!myreg.test(params)) {
      return wx.showToast({
        title: '请填写正确的手机号',
        icon: 'none'
      })
    } else {
      if (this.data.codetime > 0) return
      this.setData({
        codetime: 120
      })
      let timer = setInterval(() => {
        this.setData({
          codetime: this.data.codetime - 1
        })
        if (this.data.codetime < 1) {
          clearInterval(timer)
          this.setData({
            codetime: 0
          })
        }
      }, 1000)
      loginModel.getSms(params, res => {
        if (res.data.status == 1) {
          wx.showToast({
            title: '验证码已发送',
            icon: 'none',
          })        
        } else {
          this.setData({
            codetime: 0
          })
          wx.showToast({
            title: res.data.msg ? res.data.msg : '请求超时',
            icon: 'none'
          })
        }
      })
    }
  },

  // 下一步
  formSubmit(e) {
    const params = e.detail.value
    if (!this.WxValidate.checkForm(params)) {
      const error = this.WxValidate.errorList[0]
      wx.showToast({
        title: error.msg,
        icon: 'none'
      })
      return false
    } else if (params.password !== params.rePassword) {
      wx.showToast({
        title: '两次密码输入不一致',
        icon: 'none'
      })
      return false
    } else {
      this.setData({
        isDisabled: true
      })
      loginModel.postVerify(params.phone, params.code, res => {
        if (res.data.status == 1) {
          let data = JSON.stringify(params)
          wx.navigateTo({
            url: './register-next/register-next?params=' + data,
            success: res=> {
              this.setData({
                isDisabled: false
              })
            }
          })
         
        } else {
          wx.showToast({
            title: res.data.msg ? res.data.msg : '请求超时',
            icon: 'none',
            success: res=> {
              this.setData({
                isDisabled: false
              })
            }
          })
        }
      })
    }
  }
})