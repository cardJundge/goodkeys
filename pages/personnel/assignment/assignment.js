// 分配作业员
import {
  PersonnelModel
} from '../models/personnel.js'
import {
  IndexModel
} from '../../index/models/index.js'

var indexModel = new IndexModel()
var personnelModel = new PersonnelModel()
Page({
  data: {
    taskList: [],
    someone: true
  },
  onLoad: function (options) {
    this.data.listId = options.listId
    this.data.keyName = options.keyName
  },

  onShow() {
    this.getAllModule()
  },

  // 获取系统所有模块
  getAllModule() {
    indexModel.getAllModule(res => {
      if (res.data.status == 1) {
        res.data.data.forEach((item, index) => {
          if (item.key == this.data.keyName) {
            this.data.moduleId = item.id
            this.getTaskList()
          }
        })
      }
    })
  },

  getTaskList() {
    let params = {
      keywords: this.data.keyWords ? this.data.keyWords : '',
      module_id: this.data.moduleId
    }
    personnelModel.getTaskList(params, res=> {
      if(res.data.status == 1) {
        this.setData({
          taskList: res.data.data,
          someone: true
        })
      } else {
        this.setData({
          someone: false
        })
      }
    })
  },

  addStaff() {
    wx.navigateTo({
      url: '../add-personnel/add-personnel',
    })
  },

  taskChange(e) {
    this.data.taskId = e.detail.value
  },

  submitAssignment() {
    let params = {
      task_id: this.data.taskId,
      key: this.data.keyName,
      id: this.data.listId
    }
    indexModel.assignmentTask(params, res=> {
      if(res.data.status == 1) {
        wx.navigateBack({
          delta: 1
        })
      } else {
        if (res.data.msg.match('Token已过期或失效')) {
        } else {
          wx.showToast({
            title: res.data.msg ? res.data.msg : '请求超时',
            icon: 'none'
          })
        }
      }
    })
  },

  search(e) {
    this.data.keyWords = e.detail.value
  }
})