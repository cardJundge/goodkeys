// 商品/服务
import {
  MineModel
} from './../../models/mine.js'

var app = getApp()
var mineModel = new MineModel()
Page({

  data: {
    noService: false
  },

  onLoad: function (options) {
    this.setData({
      imgUrl: app.globalData.imgUrl
    })
  },

  onShow() {
    this.getServiceList()
  },

  getServiceList() {
    mineModel.serviceList(res => {
      if(res.data.status == 1) {
        if(res.data.data.length == 0) {
          this.setData({
            noService: true
          })
        } else {
          this.setData({
            serviceList: res.data.data,
            noService: false
          })
        }
      }
    })
  },

  // 去添加商品/服务管理
  toAddService() {
    wx.navigateTo({
      url: './add-service/add-service',
    })
  },

  // 删除商品/服务管理
  toDelService(e) {
    wx.showModal({
      title: '提示',
      content: '',
      success: res=> {
        if(res.confirm) {
          let params = {
            id: e.currentTarget.dataset.id
          }
          mineModel.delService(params, res=> {
            if(res.data.status == 1) {
              wx.showToast({
                title: '删除成功',
              })
              this.getServiceList()
            }
          })
        }
      }
    })
  },

  // 编辑商品/服务管理
  toEditService(e) {
    let serviceId = e.currentTarget.dataset.id
    let data = {}
    this.data.serviceList.forEach((item, index) => {
      if(item.id == serviceId) {
        data = JSON.stringify(item)
      }
    })
    console.log(data)
    wx.navigateTo({
      url: './add-service/add-service?data=' + data,
    })
  }
})