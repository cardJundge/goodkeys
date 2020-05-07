// 创建模块===》开始页面
import {
  IndexModel
} from './../../models/index.js'

var indexModel = new IndexModel()
var app = getApp()
Page({
  data: {

  },

  onLoad(options) {
    this.setData({
      businessArray: JSON.parse(options.businessArray),
      serviceType: app.globalData.userInfo.type
    })
    this.data.systemModuleId = []
    this.data.businessArray.forEach((item, index) => {
      if (item.key) {
        this.data.systemModuleId.push(item.id)
      }
    })
    this.getAllModule()
  },

  // 获取系统所有模块
  getAllModule() {
    indexModel.getAllModule(res => {
      if (res.data.status == 1) {
        res.data.data.forEach((item, indx) => {
          item.img = '/images/index/' + item.key + '.png'
        })
        let tempModule = res.data.data.filter(item => !this.data.systemModuleId.some(item1 => item1 === item.id))
        this.setData({
          allModule: tempModule
        })
      }
    })
  },

  // 系统模块添加
  addSystemModule(e) {
    let id = e.currentTarget.dataset.id
    this.data.systemModuleId.push(id)
    let params = {
      module: this.data.systemModuleId.join(',')
    }
    indexModel.setSelfModule(params, res => {
      if (res.data.status == 1) {
        this.getAllModule()
      }
    })
  },

  // 自定义模块添加
  addDefineModule() {
    wx.navigateTo({
      url: '../first/first',
    })
  }
})