// 联盟通知
import {
  UnionModel
} from '../models/union.js'
var unionModel = new UnionModel()
var app = getApp()
Page({
  data: {
    noticeList: []
  },

  onLoad: function (options) {
    this.setData({
      imgUrl: app.globalData.imgUrl
    })
  },

  onShow: function() {
    this.getNotice()
  },

  // 获取通知
  getNotice() {
    unionModel.applyNotice(res => {
      if (res.data.status == 1) {
        this.data.noticeList = res.data.data
        this.getUnionList()
      } else {

      }
    })
  },

  getUnionList() {
    let params = {
      type: 1
    }
    unionModel.getUnionList(params, res => {
      if (res.data.status == 1) {
       res.data.data.forEach((item, index) => {
         this.data.noticeList.forEach((its, ins) => {
           if (its.league_id == item.id) {
             its.unionFace = item.logo
             its.unionName = item.name
           }
         })
       })
       this.setData({
         noticeList: this.data.noticeList.reverse()
       })
        console.log(this.data.noticeList)
      } else {

      }
    })
  },

  // 拒绝
  toHandle(e) {
    console.log(e.currentTarget.dataset)
    let params = {
      league_id: e.currentTarget.dataset.leagueid,
      status: e.currentTarget.dataset.status,
      apply_id: e.currentTarget.dataset.applyid
    }
    unionModel.handleApply(params, res=> {
      if(res.data.status == 1) {
        wx.showToast({
          title: res.data.msg,
        })
        this.getNotice()
      } else {
        wx.showToast({
          title: res.data.msg ? res.data.msg :'操作超时',
          icon: 'none'
        })
      }
    })
  }
  
})