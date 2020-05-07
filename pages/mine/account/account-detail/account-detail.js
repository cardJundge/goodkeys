// 明细
var test = getApp().globalData.hostName
var app = getApp()
import {
  MineModel
} from '../../models/mine.js'

var mineModel = new MineModel()
Page({
  data: {
    hasMoreData: false,
    hasRecord: false,
    page: 1,
    pageSize: 20,
    beanList: []
  },
  onLoad: function (options) {
   var that = this
    mineModel.beanDetails(res=> {
      if (res.data.status == 1) {
        var beanList = that.data.beanList
        var beanInfo = res.data.data
        if (beanInfo.length == 0) {
          that.setData({
            hasRecord: false
          })
        } else {
          that.setData({
            hasRecord: true
          })
          if (beanInfo.length < that.data.pageSize) {
            that.setData({
              beanList: beanList.concat(beanInfo),
              hasMoreData: false
            })
          } else {
            that.setData({
              beanList: beanList.concat(beanInfo),
              pageSize: that.data.pageSize + 1,
              hasMoreData: false
            })
          }
        }

      }
    })
  },
  // 返回上一级
  backPage: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  onReachBottom: function () {
    var that = this
    if (that.data.hasMoreData) {
      that.onLoad()
    } else {
    }
  }
})