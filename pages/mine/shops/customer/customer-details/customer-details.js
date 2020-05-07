// 客户管理详情
import {
  MineModel
} from './../../../models/mine.js'

var app = getApp()
var mineModel = new MineModel()
Page({

  data: {
    schedule: [
      { title: '购买项目', date: '2020 1-10 11:36', content: 'xxxxx'  },
      { title: '扫码进入', date: '2020 1-10 10:36', content: '' }
    ]
  },

  onLoad(options) {
    this.data.clientId = options.id
    this.getClientDetails()
  },

  getClientDetails() {
    let params = {
      id: this.data.clientId
    }
    mineModel.clientDetail(params, res=> {
      console.log(res)
    })
  },

  toEditTags() {
    this.setData({
      tagsModalShow: true
    })
  },
})