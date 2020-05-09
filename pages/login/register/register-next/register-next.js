// 注册--》最后一步
import WxValidate from '../../../../dist/WxValidate.js'
import {
  LoginModel
} from '../../models/login.js'

var app = getApp()
var loginModel = new LoginModel()
Page({
  data: {
    register: {
      title: '注册Goodkeys企业版账号'
    },
    formData: {
      company: '',
      shortName: '',
      companyType: ''
    },
    otherData: [],
    isDisabled: false,
    companyArray: [
      '公估公司', '4s店', '维修店', '改装厂', '调查公司', '咨询公司', '轮胎', '道路救援', '二手车', '其他', '保险公司', '电信服务商'
    ]
    // companyArray: [
    //   '公估公司', '4s店', '维修店', '保险公司', '调查公司', '咨询公司', '律所'
    // ]
  },
  onLoad: function (options) {
    this.data.otherData = JSON.parse(options.params)
    this.initValidate() // 验证规则函数
  },

  initValidate() {
    const rules = {
      company: {
        required: true
      },
      shortName: {
        required: true
      }
    }
    const messages = {
      company: {
        required: '请填写公司全称'
      },
      shortName: {
        required: '请填写公司简称'
      }
    }
    this.WxValidate = new WxValidate(rules, messages)
  },

  bindCompanyChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      company: e.detail.value
    })
  },

  formSubmit(e) {
    wx.showLoading({
      title: '注册中...',
    })
    let params = e.detail.value
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
      this.data.company = Number(this.data.company) + 1
      this.data.otherData.companyType = this.data.company
      this.data.otherData.company = params.company
      this.data.otherData.shortName = params.shortName
      loginModel.postRegister(this.data.otherData, res => {
        if (res.data.status == 1) {
          this.setData({
            isDisabled: false
          })
          wx.showToast({
            title: '注册成功',
          })

          let data = {
            phone: this.data.otherData.phone,
            password: this.data.otherData.password
          }
          loginModel.postLogin(data, res1 => {
            if (res1.data.status == 1) {
              app.globalData.userInfo = res1.data.data
              wx.setStorageSync('userMobile', this.data.otherData.phone)
              wx.setStorageSync('userPwd', this.data.otherData.password)
              wx.switchTab({
                url: '/pages/index/index',
              })
            } else {
              wx.navigateBack({
                delta: 2
              })
            }
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 2
            })
          }, 10000)
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
    }
  }
})