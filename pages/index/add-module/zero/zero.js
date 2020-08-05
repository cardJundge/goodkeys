// 创建模块===》开始页面
import {
  IndexModel
} from './../../models/index.js'
import {
  MineModel
} from './../../../mine/models/mine.js'

var mineModel = new MineModel()
var indexModel = new IndexModel()
var app = getApp()
Page({
  data: {},

  onLoad(options) {
    if (options.businessArray) {
      this.setData({
        businessArray: JSON.parse(options.businessArray),
        serviceType: app.globalData.userInfo.type,
        flag: 'module'
      })
      this.data.systemModuleId = []
      this.data.businessArray.forEach((item, index) => {
        if (item.key) {
          this.data.systemModuleId.push(item.id)
        }
      })
      this.getAllModule()
    } else {
      this.setData({
        flag: 'apply',
        serApplyList: JSON.parse(options.serApplyList) //服务商拥有应用
      })
      this.data.applyIdList = []
      this.data.serApplyList.forEach((item, index) => {
        this.data.applyIdList.push(item.id)
      })
      // 获取系统所有应用
      this.getAllApply()
    }
  },

  // 获取系统所有应用
  getAllApply() {
    mineModel.getAllApplyList(res=> {
      if (res.data.status == 1) {
        this.setData({ 
          allApplyList: res.data.data
        })
        this.data.curApplyList = res.data.data.filter(item => !this.data.applyIdList.some(item1 => item1 === item.id))
        this.setData({
          curApplyList: this.data.curApplyList
        })
      }
    })
  },

  // 应用添加
  addApply(e) {
    let id = e.currentTarget.dataset.id
    this.data.applyIdList.push(id)
    let params = {
      apply: this.data.applyIdList
    }
    mineModel.editApply(params, res => {
      if (res.data.status == 1) {
        this.getAllApply()
      }
    })
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