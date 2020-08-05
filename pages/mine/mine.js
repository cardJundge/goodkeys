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
    showOfficial: false,
    basicUserInfo: {},
    animationData: {},
    subscribeList: [{
      tmplIds: "IYQh27vEqH_7a9WWxd5MmOCjvd8XDy04YoctN3jC07k",
      title: '请假审批通知',
      checked: true
    },
    {
      tmplIds: "CP1SrOWReoxdykBKhq7Qa9zkbswyruVY1cz5pnGadLU",
      title: '任务审批通知',
      checked: true
    }]
  },

  onLoad: function () {
    this.setData({
      authority: app.globalData.userInfo.parent_id
    })
    this.animation = wx.createAnimation({
      duration: 500, //动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease', //动画的效果 默认值是linear
    })
  },

  onShow() {
    this.setData({
      basicUserInfo: app.globalData.userInfo,
      avatarUrl: app.globalData.userInfo.face ? app.globalData.imgUrl + app.globalData.userInfo.face : '',
    })
    if (!app.globalData.unionId) {
      app.getAuth(res => {
        app.globalData.unionId = res.data.data.unionid
      })
    }
  },

  // 关闭公众号框
  toCloseOfficial() {
    this.setData({
      showOfficial: false
    })
  },

  bindLoad(e) {
    console.log(e)
    if (e.detail.status == 0) { }
  },

  bindError(e) {
    console.log(e)
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
    this.bindWX(data => { })
  },

  bindWX(sCallback) {
    wx.showLoading({
      title: '绑定中...',
    })
    wx.login({
      success: res => {
        let params = {
          js_code: res.code,
          type: 'gk',
          key: 3
        }
        mineModel.bindWx(params, response => {
          if (response.data.status == 1) {
            wx.showToast({
              title: '绑定成功'
            })
            this.toGetUserInfo(res => {
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
      type: 'gk',
      key: 3
    }
    mineModel.unTying(params, res => {
      if (res.data.status == 1) {
        wx.showToast({
          title: '解绑成功',
        })
        this.toGetUserInfo(res => { })
      } else {
        if (res.data.msg.match('Token已过期或失效')) { } else {
          wx.showToast({
            title: res.data.msg ? res.data.msg : '请求超时',
            icon: 'none'
          })
        }
      }
    })
  },

  // 我的商铺
  // toShops() {
  //   let openId = this.data.basicUserInfo.openId_gk
  //   if (!openId) {
  //     wx.showModal({
  //       title: '提示',
  //       content: '微信绑定后才能执行此操作，是否进行微信绑定？',
  //       success: res => {
  //         if (res.confirm) {
  //           this.bindWX(data => {
  //             if (data) {
  //               wx.navigateTo({
  //                 url: './shops/shops',
  //               })
  //             }
  //           })
  //         }
  //       }
  //     })
  //   } else {
  //     wx.navigateTo({
  //       url: './shops/shops',
  //     })
  //   }
  // },

  // 账户钱包
  toAccount() {
    let openId = this.data.basicUserInfo.openId_gk
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

  // 订阅消息
  toSubscribe() {
    if (app.globalData.unionId) {
      this.setData({
        showBottomModal: true,
        showOfficial: false
      })

      this.animation.translateY(0).step()
      this.setData({
        animationData: this.animation.export() //动画实例的export方法导出动画数据传递给组件的animation属性
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请先关注"Goodkeys"公众号,方可使用订阅消息',
        success: res => {
          if (res.confirm) {
            this.setData({
              showOfficial: true
            })
          }
        }
      })
    }
  },

  subscribeConfirm(e) {
    let params = {
      service_id: app.globalData.userInfo.id,
      tmplIds: e.detail.checkbox,
      union_id: app.globalData.unionId
    }
    console.log(params)
    mineModel.approveSubscribe(params, res => {
      if (res.data.status == 1) {
        wx.showToast({
          title: '订阅成功',
        })
      } else {
        if (res.data.msg.match('Token已过期或失效')) { } else {
          wx.showToast({
            title: res.data.msg ? res.data.msg : '请求超时',
            icon: 'none'
          })
        }
      }
    })
  },

  // 服务项目管理
  // toProject() {
  //   wx.navigateTo({
  //     url: './project/project'
  //   })
  // },

  // 进入管理员
  toAdmin() {
    wx.navigateTo({
      url: './admin/admin',
    })
  },

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
      success: function (res) {
        if (res.cancel) { } else {
          mineModel.logout(res => {
            if (res.data.status == 1) {
              wx.reLaunch({
                url: '../login/login',
              })
            } else {
              if (res.data.msg.match('Token已过期或失效')) { } else {
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