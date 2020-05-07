// 添加模块---》第三步
var app = getApp()
import {
  IndexModel
} from '../../models/index.js'

var indexModel = new IndexModel()
Page({
  data: {
    taskInputData: [],
    evaluateData: [],
    approvalData: []
  },

  onLoad(options) {
    this.data.fieldData = JSON.parse(options.fieldData)
    this.data.moduleName = options.moduleName
    this.data.moduleIcon = options.moduleIcon
    console.log('1', this.data.fieldData, '2', this.data.taskInputData, '3', this.data.moduleName, '4', this.data.moduleIcon)
  },

  onShow() {
    console.log('1', this.data.fieldData, '2', this.data.taskInputData, '3', this.data.moduleName, '4', this.data.moduleIcon)
  },

  // 去作业员录入
  toTaskInput() {
    let data = JSON.stringify(this.data.taskInputData)
    wx.navigateTo({
      url: './task-input/task-input?taskInputData=' + data,
    })
  },

  // 去管理员审批
  toApproval() {
    let data = JSON.stringify(this.data.approvalData)
    wx.navigateTo({
      url: './approval/approval?approvalData=' + data,
    })
  },

  // 去用户评价
  toEvaluate() {
    let data = JSON.stringify(this.data.evaluateData)
    wx.navigateTo({
      url: './evaluate/evaluate?evaluateData=' + data,
    })
  },


  // 确定(添加模块)
  onConfirm() {
    if (this.data.approvalData.length == 0 && this.data.evaluateData.length == 0 && this.data.taskInputData.length == 0) {
      return wx.showToast({
        title: '请创建任务流标准',
        icon: 'none'
      })
    } else {
      let params = {
        name: this.data.moduleName,
        icon: this.data.moduleIcon,
        field: this.data.fieldData
      }
      if (this.data.taskInputData.length != 0) {
        params.norm = this.data.taskInputData
      }
      if (this.data.approvalData.length != 0) {
        params.approval = this.data.approvalData
      }

      if (this.data.evaluateData.length != 0) {
        params.comment = this.data.evaluateData
      }
      indexModel.addModule(params, res => {
        if (res.data.status == 1) {
          wx.showToast({
            title: '模块创建成功',
          })
          wx.switchTab({
            url: '../../index',
          })
        } else {
          if (res.data.msg.match('Token')) { } else {
            wx.showToast({
              title: res.data.msg ? res.data.msg : '请求超时',
              icon: 'none'
            })
          }
        }
      })
    }
  }
})