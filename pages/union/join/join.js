// 加入联盟
import {
  UnionModel
} from './../models/union.js'
var unionModel = new UnionModel()
var app = getApp()
Page({
  data: {
    someUnion: false,
    unionList: [],
    spinShow: true
  },
  onLoad: function (options) {
    this.setData({
      imgUrl: app.globalData.imgUrl
    })
  },

  onShow: function() {
    this.getUnionList()
  },

  getUnionList() {
    let params = {
      type: 0
    }
    unionModel.getUnionList(params, res=> {
      if(res.data.status == 1) {
        if (res.data.data.length == 0) {
          this.setData({
            someUnion: false,
            spinShow: false
          })
        } else {
          res.data.data.forEach((item, index) => {
            item.module = item.module.split(',')
          })
          this.setData({
            unionList: res.data.data.reverse(),
            someUnion: true,
            spinShow: false
          })
        }
      } else {

      }
    })
  },

  // 去申请加入（未申请||已申请）
  toJoin(e) {
    // console.log(e.currentTarget.dataset)
    let id = e.currentTarget.dataset.id
    let status = e.currentTarget.dataset.status
    if (status == '已加入') {
      wx.navigateTo({
        url: '../union-details/union-details?data=' + id,
      })
    } else if(status == '去申请'){
      wx.navigateTo({
        url: './join-details/join-details?data=' + id + '&status=' + status,
      })
    } else{
      wx.navigateTo({
        url: './join-details/join-details?data=' + id,
      })
    }
  },

  // 已加入(进入详情)

})