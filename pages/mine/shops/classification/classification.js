// 分类管理
import {
  MineModel
} from './../../models/mine.js'

var app = getApp()
var mineModel = new MineModel()
Page({
  data: {
    noClassification: true,
    current: 1,
    spinShow: true,
    classificationData: [],
  },

  onLoad: function(options) {
    let sysInfo = wx.getSystemInfoSync()
    this.setData({
      screenHeight: sysInfo.windowHeight
    })
  },

  onShow() {
    this.getClassificationList()
  },

  // 请求分类列表
  getClassificationList() {
    mineModel.getClassificationList(res => {
      this.setData({
        spinShow: false
      })
      if(res.data.status == 1) {
        if(res.data.data.length == 0) {
          this.setData({
            noClassification: true
          })
        } else {
          this.setData({
            noClassification: false,
            classificationData: res.data.data
          })
        }
      }
    })
  },

  //点击左边事件
  selectClassification: function (e) {
    let id = e.currentTarget.dataset.id
    this.setData({
      current: id
    })
  },

  // 添加分类
  toAddClassification(e) {
    let parentId = e.currentTarget.dataset.parentid
    wx.navigateTo({
      url: './add-classification/add-classification?parentId=' + parentId,
    })
  },

  // 编辑分类
  toEditClassification(e) {
    let data = {
      childId: e.currentTarget.dataset.childid,
      childName: e.currentTarget.dataset.childname,
      parentId: e.currentTarget.dataset.parentid
    }
    console.log(JSON.stringify(data))
    wx.navigateTo({
      url: './add-classification/add-classification?data=' + JSON.stringify(data),
    })
  },

  // 删除分类
  toDelClassification(e) {
    let id = e.currentTarget.dataset.id
    console.log(id)
    wx.showModal({
      title: '提示',
      content: '确定删除该分类吗？',
      success: res=> {
        if(res.confirm) {
          let params = {
            id: id
          }
          mineModel.delClassification(params, res=> {
            if(res.data.status == 1) {
              wx.showToast({
                title: '删除成功'
              })
              this.getClassificationList()
            } else {
              wx.showToast({
                title: res.data.msg ? res.data.msg : '操作超时',
                icon: 'none'
              })
            }
          })
        }
      }
    })
  }
})