// 登录
import WxValidate from '../../dist/WxValidate.js'
import {
  LoginModel
} from './models/login.js'

var app = getApp()
var loginModel = new LoginModel()
Page({
  data: {
    isDisabled: false,
    formData: {
      phone: '',
      password: ''
    }
  },
  onLoad(options) {
    this.initValidate() // 验证规则函数
  },
  onShow() {
   this.setData({
     formData: {
       phone: wx.getStorageSync('userMobile'),
       password: wx.getStorageSync('userPwd')
     }
   })
  },

  initValidate() {
    const rules = {
      phone: {
        required: true,
        tel: true
      },
      password: {
        required: true
      }

    }
    const messages = {
      phone: {
        required: '请填写手机号',
        tel: '请填写正确的手机号'
      },
      password: {
        required: '请填写密码'
      }
    }
    this.WxValidate = new WxValidate(rules, messages)
  },

  // 去注册
  toRegister() {
    wx.navigateTo({
      url: './register/register',
    })
  },
  // 忘记密码
  toForget() {
    wx.navigateTo({
      url: './forget/forget',
    })
  },
  // 去登录
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
    } else {
      this.setData({
        isDisabled: true
      })
      loginModel.postLogin(params, res=> {
        if(res.data.status == 1) {
          app.globalData.userInfo = res.data.data
          wx.setStorageSync('userMobile', res.data.data.mobile)
          wx.setStorageSync('userPwd', params.password)
          wx.showToast({
            title: '登录成功',
            success: res=> {
              this.setData({
                isDisabled: false
              })
            }
          })
          wx.switchTab({
            url: '../index/index',
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
      setTimeout(()=> {
        this.setData({
          isDisabled: false
        })
      },10000)
    }

  }
})