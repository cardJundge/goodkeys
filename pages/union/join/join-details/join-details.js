// 申请加入详情
import {
  UnionModel
} from './../../models/union.js'
var unionModel = new UnionModel()
var app = getApp()
Page({
  data: {
    unionInfo: [],
    spinShow: true,
    isApply: false
  },

  onLoad: function (options) {
    console.log(options)
    this.setData({
      imgUrl: app.globalData.imgUrl,
      joinStatus: options.status
    })
    if(options.data) {
      this.getMemberList(options.data)
    }
  },

  // 获取联盟成员列表
  getMemberList(params) {
    unionModel.getMemberList(params, res => {
      this.setData({
        spinShow: false
      })
      if (res.data.status == 1) {
        res.data.data.module = res.data.data.module.split(',')
        this.setData({
          unionInfo: res.data.data,
          leaderId: res.data.data.service_id
        })
        res.data.data.service.forEach((item, index) => {
          if (item.id == this.data.leaderId) {
            this.setData({
              leaderInfo: item
            })
          }
        })
      }
    })
  },

  toApply() {
    this.setData({
      isApply: true
    })
    let params = {
      id: this.data.unionInfo.id,
      service_id: app.globalData.userInfo.id
    }
    unionModel.applyJoinUnion(params, res=> {
      this.setData({
        isApply: false
      })
      if(res.data.status == 1) {
        wx.showToast({
          title: '申请成功'
        })
        wx.navigateBack({
          delta: 1
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
    })
  }
})