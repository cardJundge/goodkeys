// 添加分类
import {
  MineModel
} from './../../../models/mine.js'

var app = getApp()
var mineModel = new MineModel()
Page({

  data: {
    isEdit: false
  },

  onLoad: function(options) {
    this.data.parentId = options.parentId
    if (options.data) {
      let data = JSON.parse(options.data)
      this.data.isEdit = true
      this.data.childId = data.childId
      this.data.parentId = data.parentId
      this.setData({
        classificationName: data.childName
      })
    }
  },

  getClassificationName(e) {
    this.data.classificationName = e.detail.value
  },

  toConfirm() {
    if (!this.data.classificationName) {
      return wx.showToast({
        title: '请输入分类名称',
        icon: 'none'
      })
    } else {
      let params = {
        name: this.data.classificationName,
        parent_id: this.data.parentId
      }
      if (this.data.isEdit) {
        params.id = this.data.childId
        mineModel.editClassification(params, res => {
          if (res.data.status == 1) {
            wx.showToast({
              title: '修改成功',
            })
            wx.navigateBack({
              delta: 1
            })
          } else {
            wx.showToast({
              title: res.data.msg ? res.data.msg : '操作超时',
              icon: 'none'
            })
          }
        })
      } else {
        mineModel.addClassification(params, res => {
          if (res.data.status == 1) {
            wx.showToast({
              title: '添加成功',
            })
            wx.navigateBack({
              delta: 1
            })
          } else {
            wx.showToast({
              title: res.data.msg ? res.data.msg : '操作超时',
              icon: 'none'
            })
          }
        })
      }
    }
  }
})