// 增值服务
import {
  IndexModel
} from '../models/index.js'

var indexModel = new IndexModel()
Page({
  data: {
    incrementList: []
  },

  onLoad(options) {
    this.data.moduleId = options.moduleId
    // 获取增值服务列表
    this.getIncrementList() 
  },

  getIncrementList() {
    let params = {
      key: 'added'
    }
    indexModel.getWorkList(params, res=> {
      if (res.data.status == 1) {
        this.setData({
          incrementList: res.data.data.data
        })
      }
    })
  },

  toIncrementDetails(e) {
    let id = e.currentTarget.dataset.id,
    status = e.currentTarget.dataset.status
    wx.navigateTo({
      url: './increment-details/increment-details?listId=' + id + '&status=' + status,
    })
  },

  // 搜索业务
  search() {

  }
})