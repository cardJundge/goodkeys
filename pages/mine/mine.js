// 我
import {
  MineModel
} from './models/mine.js'
import {
  LoginModel
} from '../login/models/login.js'

var app = getApp()
var loginModel = new LoginModel()
var mineModel = new MineModel()
Page({
  data: {
    basicUserInfo: {}
  },
  onLoad: function() {},
  onShow() {
    this.setData({
      basicUserInfo: app.globalData.userInfo,
      avatarUrl: app.globalData.userInfo.face ? app.globalData.imgUrl + app.globalData.userInfo.face : '',
    })
    console.log(this.data.avatarUrl)
  },

  editInfo() {
    wx.navigateTo({
      url: './edit-info/edit-info',
    })
  },

  // 修改密码
  modifyPwd() {
    wx.navigateTo({
      url: '../login/modify/modify',
    })
  },

  // 数据统计详情
  toDataDetails() {
    wx.navigateTo({
      url: '../index/statistics/statistics',
    })
  },

  // 绑定微信
  toBindWX() {
    this.bindWX(data => {})
  },

  bindWX(sCallback) {
    wx.showLoading({
      title: '绑定中...',
    })
    wx.login({
      success: res => {
        let params = {
          js_code: res.code,
          type: 'omo',
          key: 1
        }
        mineModel.bindWx(params, response => {
          if (response.data.status == 1) {
            wx.showToast({
              title: '绑定成功'
            })
            this.toGetUserInfo(res=> {
              sCallback(true)
            })
          } else if (response.data.status == -1) {

          } else {
            wx.showToast({
              title: response.data.msg ? response.data.msg : '请求超时',
              icon: 'none'
            })
          }
        })
      }
    })
  },

  // 解绑微信
  unbindWX() {
    wx.showLoading({
      title: '解绑中...',
    })
    let params = {
      type: 'omo',
      key: 1
    }
    mineModel.unTying(params, res => {
      if (res.data.status == 1) {
        wx.showToast({
          title: '解绑成功',
        })
        this.toGetUserInfo(res=> {})
      } else {
        if (res.data.msg.match('Token已过期或失效')) {} else {
          wx.showToast({
            title: res.data.msg ? res.data.msg : '请求超时',
            icon: 'none'
          })
        }
      }
    })
  },

  // 我的商铺
  toShops() {
    let openId = this.data.basicUserInfo.openId_omo
    if (!openId) {
      wx.showModal({
        title: '提示',
        content: '微信绑定后才能执行此操作，是否进行微信绑定？',
        success: res => {
          if (res.confirm) {
            this.bindWX(data => {
              if (data) {
                wx.navigateTo({
                  url: './shops/shops',
                })
              }
            })
          }
        }
      })
    } else {
      wx.navigateTo({
        url: './shops/shops',
      })
    }
  },

  // 账户钱包
  toAccount() {
    let openId = this.data.basicUserInfo.openId_omo
    if (!openId) {
      wx.showModal({
        title: '提示',
        content: '微信绑定后才能执行此操作，是否进行微信绑定？',
        success: res => {
          if (res.confirm) {
            this.bindWX(data => {
              if (data) {
                wx.navigateTo({
                  url: './account/account',
                })
              }
            })
          }
        }
      })
    } else {
      wx.navigateTo({
        url: './account/account',
      })
    }
  },

  // 绑定解绑之后重新请求用户信息（重新登录）
  toGetUserInfo(sCallback) {
    let params = {
      phone: wx.getStorageSync('userMobile'),
      password: wx.getStorageSync('userPwd')
    }
    loginModel.postLogin(params, res => {
      if (res.data.status == 1) {
        app.globalData.userInfo = res.data.data
        this.setData({
          basicUserInfo: res.data.data
        })
        sCallback(true)
      }
    })
  },

  // 服务项目管理
  // toProject() {
  //   wx.navigateTo({
  //     url: './project/project'
  //   })
  // },

  // 购买商业版本
  toBuyBusiness() {
    wx.navigateTo({
      url: '/pages/personnel/add-quota/add-quota',
    })
  },

  // 服务品牌
  // toService() {
  //   wx.navigateTo({
  //     url: './service-brand/service-brand',
  //   })
  // },

  // 退出登录
  toLogout() {
    wx.showModal({
      title: '提示',
      content: '确定退出登录吗',
      success: function(res) {
        if (res.cancel) {} else {
          mineModel.logout(res => {
            if (res.data.status == 1) {
              wx.reLaunch({
                url: '../login/login',
              })
            } else {
              if (res.data.msg.match('Token已过期或失效')) {} else {
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
  }
})