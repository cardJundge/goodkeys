// 联盟
import {
  UnionModel
} from './models/union.js'
var unionModel = new UnionModel()
var app = getApp()
Page({
  data: {
    someUnion: true,
    myUnionList: [],
    spinShow: true,
  },
  onLoad: function(options) {
    this.setData({
      imgUrl: app.globalData.imgUrl
    })
  },

  onShow: function() {
    this.getMyUnionList()
    this.getNotice()
  },

  // 获取通知
  getNotice() {
    unionModel.applyNotice(res=> {
      this.setData({
        spinShow: false
      })
      let noticeList = []
      if(res.data.status == 1) {
        if(res.data.data) {
          res.data.data.forEach((item, index) => {
            if (item.status == 0) {
              noticeList.push(item)
            }
          })
        }

        this.setData({
          noticeList: noticeList
        })
      } else {

      }
    })
  },

  // 获取我的联盟列表
  getMyUnionList() {
    let params = {
      type: 1
    }
    unionModel.getUnionList(params, res=> {
      if(res.data.status == 1) {
        if (res.data.data.length == 0) {
          this.setData({
            someUnion: false
          })
        } else {
          res.data.data.forEach((item, index) => {
            item.module = item.module.split(',')
          })
          this.setData({
            myUnionList: res.data.data.reverse(),
            someUnion: true
          })
        }
      } else {

      }
    })
  },

  // 打开底部选项框
  openUnionSheet() {
    wx.showActionSheet({
      itemList: ['创建联盟', '申请加入联盟'],
      success: (res)=> {
        console.log(res.tapIndex);
        if (res.tapIndex === 0) {
          this.establishUnion()
        } else if (res.tapIndex === 1) {
          this.applyUnion()
        }
      }
    })
  },

  // 申请加入
  applyUnion() {
    wx.navigateTo({
      url: './join/join',
    })
  },

  // 创建联盟
  establishUnion() {
    wx.navigateTo({
      url: './establish/establish',
    })
  },

  // 进入联盟详情
  toUnionDetails(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: './union-details/union-details?data=' + id
    })
  },

  // 进入通知列表
  toNoticeList() {
    wx.navigateTo({
      url: './notice/notice',
    })
  },

  // 搜索
  search(e) {
    console.log(e)
  }
})