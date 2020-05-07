// 我的商铺/开通商铺
import {
  MineModel
} from './../models/mine.js'

var app = getApp()
var mineModel = new MineModel()
Page({

  data: {
    isOpen: false,
    spinShow: true,
    shareShow: false,
    noShops: true,
  },

  onLoad(options) {
    this.haveShops()
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.writePhotosAlbum']) {
          this.setData({
            photoLimit: true
          })
        } else {
          this.setData({
            photoLimit: false
          })
        }

      }
    })
    this.setData({
      serviceFace: app.globalData.userInfo.face ? app.globalData.imgUrl + app.globalData.userInfo.face : '',
      serviceName: app.globalData.userInfo.name
    })
    console.log(this.data.serviceFace)
  },

  onShow() {
    this.getShopsDetails()
  },

  // 是否开通商铺
  haveShops() {
    mineModel.haveShops(res => {
      this.setData({
        spinShow: false
      })
      if (res.data == 0) {
        this.setData({
          isOpen: false
        })
        wx.setNavigationBarTitle({
          title: '开通商铺'
        })
      } else if (res.data == 1) {
        this.setData({
          isOpen: true
        })
        wx.setNavigationBarTitle({
          title: '我的商铺'
        })
        this.getShopsDetails()
      }
    })
  },

  // 是否填写商铺详情
  getShopsDetails() {
    mineModel.shopsDetails(res => {
      if (res.data.status == 1) {
        // 有商铺
       this.data.noShops = false
       this.data.shopsDetailsData = res.data.data
      } else if(res.data.status == 0) {
        // 暂无数据还未添加商铺
       this.data.noShops = true
      }
    })
  },

  // 开通商铺 ==>第一步（支付）
  openShopsFirst() {
    let params = {
      type: '0',
      body: '开通商铺',
      openid: app.globalData.userInfo.openId_omo,
      money: '0.01',
    }
    mineModel.toPay(params, res => {
      console.log(res)
      if (res.data.status == 1) {
        let payInfo = res.data.data
        wx.requestPayment({
          timeStamp: payInfo.timeStamp.toString(),
          nonceStr: payInfo.nonceStr,
          package: payInfo.package,
          signType: payInfo.signType,
          paySign: payInfo.sign,
          success: res => {
            if (res.errMsg == 'requestPayment:ok') {
              this.openShopsSecond(payInfo.out_trade_no)
            }
          },
          fail: err => {
            wx.showToast({
              title: '支付失败',
              icon: 'none'
            })
          }
        })
      }
    })
  },

  // 开通商铺 ==>第二步（开通接口）
  openShopsSecond(tradeNo) {
    let params = {
      trade_no: tradeNo
    }
    mineModel.openShops(params, res => {
      console.log(res)
      if (res.data.status == 1) {
        this.setData({
          isOpen: true
        })
        wx.showToast({
          title: '开通成功',
        })
        this.getShopsDetails()
      } else {
        wx.showToast({
          title: res.data.msg ? res.data.msg : '操作超时',
          icon: 'none'
        })
      }
    })
  },

  // 进入收入记录
  toIncomeRecord() {
    wx.navigateTo({
      url: './record/record',
    })
  },

  // 商铺管理
  toShopsManagement() {
   if(this.data.noShops) {
     wx.navigateTo({
       url: './shops-management/shops-management',
     })
   } else {
     let data = JSON.stringify(this.data.shopsDetailsData)
     wx.navigateTo({
       url: './shops-management/shops-management?data=' + data,
     })
   }
  },

  // 客户管理
  toCustomer() {
    if (this.data.noShops) {
      wx.showModal({
        title: '提示',
        content: '暂无商铺信息，立即添加',
        success: res => {
          if (res.confirm) {
            wx.navigateTo({
              url: './shops-management/shops-management',
            })
          }
        }
      })
    } else {
      wx.navigateTo({
        url: './customer/customer',
      })
    }
  },

  // 商品/服务管理
  toService() {
    if (this.data.noShops) {
      wx.showModal({
        title: '提示',
        content: '暂无商铺信息，立即添加',
        success: res=> {
          if(res.confirm) {
            wx.navigateTo({
              url: './shops-management/shops-management',
            })
          }
        }
      })
    } else {
      wx.navigateTo({
        url: './service/service',
      })
    }
  },

  // 分类管理
  toClassification() {
    if (this.data.noShops) {
      wx.showModal({
        title: '提示',
        content: '暂无商铺信息，立即添加',
        success: res => {
          if (res.confirm) {
            wx.navigateTo({
              url: './shops-management/shops-management',
            })
          }
        }
      })
    } else {
      wx.navigateTo({
        url: './classification/classification',
      })
    }
  },

  // 添加商品/服务
  toAddService() {
    if (this.data.noShops) {
      wx.showModal({
        title: '提示',
        content: '暂无商铺信息，立即添加',
        success: res => {
          if (res.confirm) {
            wx.navigateTo({
              url: './shops-management/shops-management',
            })
          }
        }
      })
    } else {
      wx.navigateTo({
        url: './service/add-service/add-service',
      })
    }
  },

  // 推广商铺
  toShareShops() {
    this.setData({
      shareShow: true,
      emptyObj: {}
    })
  }
})