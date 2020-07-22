// 作业员选择
var app = getApp()
import {
  PersonnelModel
} from '../../../personnel/models/personnel.js'

var personnelModel = new PersonnelModel()
Page({
  data: {
    isSelectAll: false,
    numPeople: 0
  },

  onLoad(options) {
    this.setData({
      imgUrl: app.globalData.imgUrl
    })
    if (options.flag) {
      let taskData = JSON.parse(options.taskData),
        taskDataSelected = JSON.parse(options.taskDataSelected)
      console.log(taskData, taskDataSelected)
      this.data.selectTaskData = []
      taskData.forEach((item, index) => {
        item.checked = false
        taskDataSelected.forEach((item1, index1) => {
          if (item.id == item1.id) {
            item.checked = true
            this.data.selectTaskData.push(item1)
          }
        })
      })
      this.setData({
        taskList: taskData
      })
    } else {
      this.setData({
        selectTaskData: JSON.parse(options.data)
      })
      this.getTaskList()
    }
  },

  // 获取作业员列表
  getTaskList() {
    let params = {
    }
    personnelModel.getTaskList(params, res => {
      if (res.data.status == 1) {
        res.data.data.forEach((item, index) => {
          item.checked = false
          this.data.selectTaskData.forEach((item1, index1) => {
            if (item.id == item1.id) {
              item.checked = true
            }
          })
        })
        this.setData({
          taskList: res.data.data
        })
        console.log(this.data.taskList)
      }
    })
  },

  // 全选
  selectAll() {
    this.data.taskList.forEach((item, index) => {
      item.checked = true
    })
    this.setData({
      taskList: this.data.taskList,
      isSelectAll: true,
      numPeople: this.data.taskList.length
    })
    this.data.selectTaskData = this.data.taskList
  },

  // 取消全选
  selectAll01() {
    this.data.taskList.forEach((item, index) => {
      item.checked = false
    })
    this.setData({
      taskList: this.data.taskList,
      isSelectAll: false,
      numPeople: 0
    })
    this.data.selectTaskData = []
  },

  // 多选框
  taskChange(e) {
    this.setData({
      numPeople: e.detail.value.length
    })
    this.data.selectTaskData = []
    this.data.taskList.forEach((item, index) => {
      e.detail.value.forEach((item1, index1) => {
        if (item1 == item.id) {
          this.data.selectTaskData.push(item)
        }
      })
    })
  },

  // 确定
  onConfirm() {
    console.log(this.data.selectTaskData)
    var pages = getCurrentPages()
    var currPage = pages[pages.length - 1] //当前页面
    var prevPage = pages[pages.length - 2] //上一个页面

    prevPage.setData({
      selectTaskData: this.data.selectTaskData
    })
    wx.navigateBack({
      delta: 1
    })
  }
})