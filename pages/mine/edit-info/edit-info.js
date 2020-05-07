// 修改基本信息
import {
  MineModel
} from '../models/mine.js'
import {
  LoginModel
} from '../../login/models/login.js'

var mineModel = new MineModel()
var loginModel = new LoginModel()
var app = getApp()

Page({
  data: {
    avatarUrl: '',
    companyName: '',
    basicUserInfo: {}
  },
  onLoad: function (options) {
    this.setData({
      basicUserInfo: app.globalData.userInfo,
      avatarUrl: app.globalData.userInfo.face ? app.globalData.imgUrl + app.globalData.userInfo.face : '',
      companyName: app.globalData.userInfo.name
    })
  },

  companyInput(e) {
    this.setData({
      companyName: e.detail.value
    })
  },

  // 上传图片
  uploadAvatar() {
    var that = this
    wx.chooseImage({
      success(res) {
        const tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: app.globalData.hostName + '/api/auth/upload',
          filePath: tempFilePaths[0],
          name: 'file',
          success(res1) {
            let data = JSON.parse(res1.data)
            that.setData({
              avatarUrl: app.globalData.imgUrl + data.data.filename,
              avatar: data.data.filename
            })
          }
        })
      }
    })
  },

  // 确定==》修改信息
  onConfirm() {
    wx.showLoading({
      title: '修改中...',
    })
    if (!this.data.avatar) {
      this.data.avatar = ''
    }
    mineModel.modifyInfo(this.data.avatar, this.data.companyName, res => {
      if (res.data.status == 1) {
        let params = {
          phone: wx.getStorageSync('userMobile'),
          password: wx.getStorageSync('userPwd')
        }
        loginModel.postLogin(params, res => {
          app.globalData.userInfo = res.data.data
          wx.showToast({
            title: '修改成功',
          })
          wx.navigateBack({
            delta: 1
          })
        })
      } else {
        if (res.data.msg.match('Token已过期或失效')) {
        } else {
          wx.showToast({
            title: res.data.msg ? res.data.msg : '请求超时',
            icon: 'none'
          })
        }
      }
      setTimeout(() => {
        this.setData({
          isDisabled: false
        })
      }, 10000)
    })
  }
})