// 转单公司选择
import {
  IndexModel
} from '../../models/index.js'

var indexModel = new IndexModel()
var app = getApp()
Page({
  data: {
    currentUnion: "",
    unionData: [],
    currentCompany: ''
  },

  onLoad: function(options) {
    console.log(options)
    this.data.businessInfo = options
    // this.data.moduleName = options.businessName
    let sysInfo = wx.getSystemInfoSync()
    this.setData({
      // currentUnion: this.data.unionData[0].id,
      screenHeight: sysInfo.windowHeight,
      serviceId: app.globalData.userInfo.id
    })
    this.getModuleUnion()
  },

  // 获取模块下的联盟和联盟成员
  getModuleUnion() {
    let params = {
      key: this.data.businessInfo.moduleName,
      module: this.data.businessInfo.moduleType
    }
    indexModel.getModuleUnion(params, res=> {
      console.log(res)
      if(res.data.status == 1) {
        this.setData({
          unionData: res.data.data,
          currentUnion: res.data.data[0].id
        })
      }
    })
  },

  //点击左边事件
  selectUnion: function(e) {
    let unionid = e.currentTarget.dataset.id
    this.setData({
      currentUnion: unionid
    })
  },

  // 公司选择
  companyChange(e) {
    console.log(e.detail.value)
    this.data.currentCompanyId = e.detail.value
    this.data.unionData.forEach((item, index) => {
      if (item.id == this.data.currentUnion) {
        item.service.forEach((its, ins) => {
          if (its.id == this.data.currentCompanyId) {
            this.data.currentCompanyName = its.name
          }
        })
      }
    })
  },

  onConfirm(e) {
    this.data.businessInfo.companyName = this.data.currentCompanyName
    this.data.businessInfo.companyId = this.data.currentCompanyId
    let data = JSON.stringify(this.data.businessInfo)
    if (this.data.currentCompanyId) {
      wx.navigateTo({
        url: '../transfer?data=' + data,
      })
    }
  }

})