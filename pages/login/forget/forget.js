// 忘记密码
import WxValidate from '../../../dist/WxValidate.js'
import {
  LoginModel
} from '../models/login.js'

var loginModel = new LoginModel()
Page({
  data: {
    forget: {
      title: '忘记密码',
    },
    codetime: 0,
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
      wx.showToast({
        title: '请填写正确的手机号',
        icon: 'none'
      })
      return false
    } else {
      if (this.data.codetime > 0) return
      loginModel.getSms(params, res => {
        if (res.data.status == 1) {
          wx.showToast({
            title: '验证码已发送',
            icon: "none",
            success: () => {
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
            }
          });
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      })
    }
  },
  formSubmit(e) {
    console.log(e)
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
      let param = {
        mobile: params.phone,
        code: params.code,
        password: params.password,
        repeat_password: params.rePassword
      }
      loginModel.forgetPwd(param, res=> {
        if(res.data.status == 1) {
          wx.showToast({
            title: '修改成功'
          })
          wx.redirectTo({
            url: '../login',
          })
        } else {
          wx.showToast({
            title: res.data.msg? res.data.msg : '操作超时',
            icon: 'none'
          })
        }
      })
    }
  }
})