// 自定义模块列表
var app = getApp()
import {
  IndexModel
} from '../models/index.js'

var indexModel = new IndexModel()
Page({
  data: {
    taskflowList: [],
    proportion: 80,
    noData: false,
    page: 1,
    pageSize: 20,
    spinShow: true
  },

  onLoad(options) {
    this.setData({
      moduleId: options.moduleId,
      moduleName: options.moduleName
    })
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.windowHeight
        })
      }
    })
    wx.setNavigationBarTitle({
      title: options.moduleName
    })
    this.getModuleField()
  },

  onShow() {
    this.setData({
      page: 1,
      spinShow: true,
      taskflowList: []
    })
    this.getTaskflowList()
  },

  // 获取模块字段
  getModuleField() {
    let params = {
      id: this.data.moduleId
    }
    indexModel.getModuleField(params, res => {
      if (res.data.status == 1) {
        this.setData({
          field: res.data.data.field
        })
        console.log(this.data.field)
      }
    })
  },

  getTaskflowList() {
    let params = {
      module_id: this.data.moduleId,
      page: this.data.page,
    }
    indexModel.getTaskflowList(params, res => {
      let taskflowList = this.data.taskflowList
      let taskflowInfo = res.data.data.data
      if (res.data.status == 1) {
        if (this.data.page == 1 && res.data.data.data.length == 0) {
          this.setData({
            noData: true,
            spinShow: false
          })
        } else {
          // ------------------------------------------------
          taskflowInfo.forEach((item, index) => {
            if (item.norm) {
              let tempArr1 = []
              item.norm.forEach((item1, index1) => {
                if (item1.record) {
                  tempArr1.push(item1)
                }
              })
              item.showType = 'norm'
              item.percentage = Math.floor(tempArr1.length / item.norm.length * 100)
            }

            if (!item.norm && (item.approval || item.comment)) {
              item.showType = 'norm'
              item.percentage = 100
            }
          })
          taskflowInfo.forEach((item, index) => {
            item.transcendData = []
            item.field.forEach((item1, index1) => {
              item1.isShow = this.data.field[index1].isShow
              if (item1.isShow == 1) {
                item.transcendData.push(item1.value)
              }
            })
          })
          // -------------------------------------------------
          if (taskflowInfo.length < this.data.pageSize) {
            this.setData({
              taskflowInfo: taskflowInfo,
              taskflowList: taskflowList.concat(taskflowInfo),
              hasMoreData: false
            })
          } else {
            this.setData({
              taskflowInfo: taskflowInfo,
              taskflowList: taskflowList.concat(taskflowInfo),
              hasMoreData: true
            })
          }
          this.setData({
            noData: false,
            spinShow: false,
          })
          console.log(this.data.taskflowList)
        }
      }
    })
  },

  // 进入任务流详情
  toTaskflowDetail(e) {
    if (this.data.endTime - this.data.startTime < 350) {
      let listId = e.currentTarget.dataset.id,
        taskname = e.currentTarget.dataset.taskname
      wx.navigateTo({
        url: './taskflow-details/taskflow-details?listId=' + listId + '&taskname=' + taskname + '&moduleName=' + this.data.moduleName,
      })
    }

  },

  // 添加任务流
  addTaskflow() {
    wx.navigateTo({
      url: './add-taskflow/add-taskflow?moduleId=' + this.data.moduleId,
    })
  },

  // 删除任务流
  toDelTaskflow(e) {
    let listId = e.currentTarget.dataset.id
    // this.data.caseDelFlag = true
    wx.showModal({
      title: '提示',
      content: '是否删除该案件?',
      success: res => {
        if (res.confirm) {
          let params = {
            id: listId
          }

          indexModel.delTaskflow(params, res => {
            if (res.data.status == 1) {
              wx.showToast({
                title: '删除成功',
              })
              this.setData({
                spinShow: true,
                taskflowList: [],
                page: 1
              })
              this.getTaskflowList()
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
  },

  // 上拉加载
  onReachBottom() {
    if (this.data.hasMoreData) {
      this.data.page = this.data.page + 1
      this.getTaskflowList()
    }
  },

  bindTouchStart(e) {
    this.data.startTime = e.timeStamp
  },

  bindTouchEnd(e) {
    this.data.endTime = e.timeStamp
  }
})