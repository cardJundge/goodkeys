// 客户管理
import {
  MineModel
} from './../../models/mine.js'

var app = getApp()
var mineModel = new MineModel()
Page({

  data: {
    someOne: false,
    tagsModalShow: false,
    clientData: []
  },

  onLoad(options) {
    this.getClientList()
  },

  // 获取客户列表
  getClientList() {
    mineModel.clientList(res=> {
      if(res.data.status == 1) {
        if(res.data.data.length == 0) {
          this.setData({
            someOne: false
          })
        } else {
          this.setData({
            clientList: res.data.data,
            someOne: true
          })
        }
      }
    })
  },

  toEditTags(e) {
    let id = e.currentTarget.dataset.id
    this.data.clientList.forEach((item,index) => {
      if(id == item.id) {
        this.setData({
          clientData: item
        })
      }
    })
    this.setData({
      tagsModalShow: true
    })
  },

  toCustomerDetails(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: './customer-details/customer-details?id=' + id,
    })
  }
})