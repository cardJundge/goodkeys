// 修改密码
import WxValidate from '../../../dist/WxValidate.js'
import {
  LoginModel
} from '../models/login.js'

var loginModel = new LoginModel()
Page({
  data: {
    formData: {
      oldPassword: '',
      password: '',
      repeatPassword: ''
    }
  },
  onLoad: function (options) {
    this.initValidate() // 验证规则函数
  },

  initValidate() {
    const rules = {
      oldPassword: {
        required: true
      },
      password: {
        required: true,
        minlength: 6
      },
      repeatPassword: {
        required: true
      }

    }
    const messages = {
      oldPassword: {
        required: '请输入旧密码'
      },
      password: {
        required: '请输入新密码',
        minlength: '密码不少于6个字符'
      },
      repeatPassword: {
        required: '请重复新密码'
      }
    }
    this.WxValidate = new WxValidate(rules, messages)
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
    } else if (params.password !== params.repeatPassword) {
      wx.showToast({
        title: '两次密码输入不一致',
        icon: 'none'
      })
      return false
    } else {
      loginModel.modifyPwd(params, res=> {
        if(res.data.status == 1) {
          wx.showToast({
            title: '密码修改成功',
            success: res=> {
              wx.reLaunch({
                url: '../login',
              })
            }
          })
        }else {
          if (res.data.msg.match('Token已过期或失效')) {
          } else {
            wx.showToast({
              title: res.data.msg ? res.data.msg : '请求超时',
              icon: 'none'
            })
          }
        }
      })
    }
  }
})