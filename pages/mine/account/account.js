// pages/index/updateData/Account/Account.js
var test = getApp().globalData.hostName
var app = getApp()
import {
  MineModel
} from '../models/mine.js'

var mineModel = new MineModel()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btnTrigger: false,
    name: '',
    cashNum: '', //提现金额
    cashData: null, //账户余额
    showSuccess: false, // 是否显示提现成功页面
    withdrawalLoding: false
  },

  onLoad: function (options) {
    this.setData({
      openId: app.globalData.userInfo.openId_omo
    })
    mineModel.getBean(res=> {
      if (res.data.status == 1) {
        this.setData({
          cashData: res.data.data.gold
        })
      }
    })
  },

  // 提现明细
  toCashDetails: function (e) {
    wx.navigateTo({
      url: './account-detail/account-detail',
    })
  },
  // input框中的name
  getName: function (e) {
    this.setData({
      name: e.detail.value
    })
    this.checkVal()
  },

  validateNumber(val) {
    return val.replace(/\D/g, '')
  },

  // input框中的提现金额
  getNumber: function (e) {
    let value = this.validateNumber(e.detail.value)
    this.setData({
      cashNum: value
    })
    this.checkVal()
  },

  // 全部提现
  onAllCashTap: function (e) {
    this.setData({
      cashNum: parseInt(this.data.cashData)
    })
    this.checkVal()
  },

  // 查看input中是否有值
  checkVal: function (e) {
    if (this.data.name !== '' && this.data.cashNum !== '') {
      this.setData({
        btnTrigger: true
      })
    } else {
      this.setData({
        btnTrigger: false
      })
    }
  },

  // 去提现
  onCashTap: function (e) {
    var that = this
    that.setData({
      withdrawalLoding: true,
      btnTrigger: false
    })
    let params = {
      type: 'omo',
      bean: that.data.cashNum,
      openid: that.data.openId,
      true_name: that.data.name
    }
    mineModel.toWithdrawal(params, res=> {
      if (res.data.status == 1) {
        that.setData({
          showSuccess: true
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1500,
          success: res => {
            setTimeout(function () {
              //要延时执行的代码
              that.setData({
                name: '',
                cashNum: '',
                withdrawalLoding: false
              });
              that.onLoad()
            }, 1500)
          }
        })
      }
    })

  },

  // 提现成功返回到个人中心页面
  goBackMine: function (e) {
    wx.navigateBack({
      delta: 1
    })
  },
  // 提现成功后进入继续提现页面
  goCash: function (e) {
    this.setData({
      showSuccess: false,
      name: '',
      cashNum: ''
    })
    this.onLoad()
  }
})