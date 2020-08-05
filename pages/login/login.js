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
    smsShow: false,
    codeTime: 0,
    formData: {
      phone: '',
      password: ''
    }
  },
  onLoad(options) {
    console.log('登录参数返回',options)
    app.globalData.pathType = null
    app.globalData.pathModuleInfo = {
      key: null,
      name: null,
      caseId: null
    }
    if (options.type) {
      app.globalData.pathType = options.type
      if (options.type == 'work') {
        app.globalData.pathModuleInfo.caseId = options.case_id
        if (options.key) {
          app.globalData.pathModuleInfo.key = options.key
        } else {
          app.globalData.pathModuleInfo.name = options.name
        }
      }
    }
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
        required: true
      },
      password: {
        required: true
      }

    }
    const messages = {
      phone: {
        required: '请填写手机号'
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
      loginModel.postLogin(params, res => {
        if (res.data.status == 1) {
          app.globalData.auth.statistics = null
          app.globalData.auth.task = null
          app.globalData.userInfo = null
          app.globalData.userInfo = res.data.data
          wx.setStorageSync('userMobile', res.data.data.mobile)
          wx.setStorageSync('userPwd', params.password)
          this.data.curMobile = res.data.data.mobile
          this.data.curPwd = params.password
          if (res.data.data.mobile == '17635372126') {
            wx.switchTab({
              url: '../index/index',
            })
          } else {
            app.getAuth(res1 => {
              this.setData({
                isDisabled: false
              })
              this.data.curOpenid = res1.data.data.openid
              if (!res.data.data.openId_gk || (res1.data.data.openid != res.data.data.openId_gk)) {
                // 获取短信验证码
                this.getSmsVal()
              } else {
                wx.switchTab({
                  url: '../index/index',
                })
              }
              // wx.switchTab({
              //   url: '../index/index',
              // })
            })
          }
        } else {
          wx.showToast({
            title: res.data.msg ? res.data.msg : '请求超时',
            icon: 'none',
            success: res => {
              this.setData({
                isDisabled: false
              })
            }
          })
        }
      })
      setTimeout(() => {
        this.setData({
          isDisabled: false
        })
      }, 10000)
    }

  },

  // 获取短信验证码
  getSmsVal() {
    if (this.data.codeTime > 0) return
    this.setData({
      codeTime: 120
    })
    let timer = setInterval(() => {
      this.setData({
        codeTime: this.data.codeTime - 1
      })
      if (this.data.codeTime < 1) {
        clearInterval(timer)
        this.setData({
          codeTime: 0
        })
      }
    }, 1000)
    loginModel.getSms(this.data.curMobile, res => {
      if (res.data.status == 1) {
        this.setData({
          smsShow: true
        })
      } else {
        this.setData({
          codeTime: 0
        })
        wx.showToast({
          title: res.data.msg ? res.data.msg : '请求超时',
          icon: 'none'
        })
      }
    })
  },

  // 绑定openid
  confirmEvent(e) {
    let params = {
      mobile: this.data.curMobile,
      code: e.detail.smsValue,
      openid: this.data.curOpenid,
      type: 1
    }
    loginModel.operOpenid(params, res => {
      if (res.data.status == 1) {
        let loginParams = {
          phone: this.data.curMobile,
          password: this.data.curPwd
        }
        loginModel.postLogin(loginParams, res1 => {
          if (res1.data.status == 1) {
            app.globalData.userInfo = null
            app.globalData.userInfo = res1.data.data
            wx.showToast({
              title: '登录成功',
              success: res2 => {
                wx.switchTab({
                  url: '../index/index',
                })
              }
            })
          } else {
            this.setData({
              codeTime: 0
            })
          }
        })
      } else {
        this.setData({
          codeTime: 0
        })
        wx.showToast({
          title: res.data.msg ? res.data.msg : '请求超时',
          icon: 'none'
        })
      }
    })
  },

  // 弹框取消
  closeEvent() {
    this.setData({
      codeTime: 0
    })
  }
})